const TravelListModel = require('../models/travelListModel');
const DestinationModel = require('../models/destinationModel');
const cloudinary = require("cloudinary").v2;
const UserModel = require('../models/userModel'); // for collaborator email lookup
const { sendCollaboratorRemovedEmail, sendCollaboratorInviteEmail } = require('../utils/mailService');
const { CLIENT_URL } = require('../config/config');

// Create travel list
const createTravelList = async (listData, file, userId) => {
    const { title, description, tags, isPublic } = listData;

    let coverImage = '';
    let public_id = '';

    try {
        if (file) {
            const result = await cloudinary.uploader.upload(file.path || file, {
                folder: 'travel_lists',
                resource_type: 'auto'
            });
            coverImage = result.secure_url;
            public_id = result.public_id;
        }

        const travelList = new TravelListModel({
            title,
            description,
            tags: Array.isArray(tags)
                ? tags.map(t => t.trim())
                : tags
                    ? JSON.parse(tags).map(t => t.trim())
                    : [],
            isPublic: isPublic !== undefined ? isPublic : true,
            owner: userId,
            coverImage,
            public_id
        });

        await travelList.save();

        // Push list to user's lists only after successful save
        await UserModel.findByIdAndUpdate(userId, { $push: { lists: travelList._id } });

        const populatedList = await TravelListModel.findById(travelList._id)
            .populate('owner', 'username profileImage')
            .populate('collaborators', 'username profileImage')
            .populate('destinations');

        return { success: true, message: "Travel list created successfully", data: populatedList };
    } catch (err) {
        // If Cloudinary uploaded a file but save failed, destroy the uploaded image
        if (public_id) {
            await cloudinary.uploader.destroy(public_id);
        }
        throw new Error(err.message);
    }
};

const getPublicTravelLists = async (params = {}) => {
  const { page = 1, limit = 3, tag, excludeUserId } = params;
  const skip = (page - 1) * limit;

  const query = { isPublic: true };

  if (tag) {
    query.tags = { $in: [tag] };
  }

  if (excludeUserId) {
      query.owner = { $ne: excludeUserId };
    }

  console.log("Final Query (service):", query);

  const lists = await TravelListModel.find(query)
    .populate("owner", "username fullName profileImage")
    .populate("collaborators", "username fullName profileImage")
    .populate("destinations", "-listId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await TravelListModel.countDocuments(query);

  return {
    lists,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    total,
  };
};




// Get all lists for a user (owner + collaborator)
const getAllLists = async (userId) => {
    const lists = await TravelListModel.find({
        $or: [{ owner: userId }, { collaborators: userId }]
    })
        .populate('owner', 'username fullName profileImage')
        .populate('collaborators', 'username fullName profileImage')
        .populate('destinations')
        .sort({ createdAt: -1 });

    return lists;
};

// Get user own lists
const getUserOwnLists = async (userId) => {
    return await TravelListModel.find({ owner: userId })
        .populate('owner', 'username fullName profileImage')
        .populate('collaborators', 'username fullName profileImage')
        .populate('destinations')
        .sort({ createdAt: -1 });
};

// Get collaborative lists
const getUserCollaborativeLists = async (userId) => {
    const lists = await TravelListModel.find({ collaborators: userId })
        .populate('owner', 'username fullName profileImage')
        .populate('collaborators', 'username fullName profileImage')
        .populate('destinations')
        .sort({ createdAt: -1 });

    return lists;
};


// Get single list
const getTravelList = async (id, userId) => {
    const list = await TravelListModel.findById(id)
        .populate('owner', 'username fullName profileImage')
        .populate('collaborators', 'username fullName profileImage')
        .populate('destinations');

    if (!list) throw new Error('Travel list not found');

    if (!list.isPublic &&
        list.owner._id.toString() !== userId &&
        !list.collaborators.some(c => c._id.toString() === userId)) {
        throw new Error("You don't have access to this travel list");
    }

    return list;
};

// Update travel list
const updateTravelList = async (id, updateData, userId, file) => {
    let list = await TravelListModel.findById(id);
    if (!list) return { success: false, message: "Travel list not found" };

    // Check permissions
    const isOwner = list.owner.toString() === userId;
    const isCollaborator = list.collaborators.some(c => c.toString() === userId);

    if (!isOwner && !isCollaborator) {
        return { success: false, message: "Only the owner or collaborators can update this list" };
    }

    // Handle cover image upload
    if (file) {
        if (list.coverImage && list.public_id) {
            await cloudinary.uploader.destroy(list.public_id);
        }
        const result = await cloudinary.uploader.upload(file.path || file, {
            folder: "travel_lists",
            resource_type: "auto",
        });
        list.coverImage = result.secure_url;
        list.public_id = result.public_id;
    }

    const { title, description, tags, isPublic } = updateData;

    // Editable by owner & collaborators
    if (title !== undefined) list.title = title;
    if (description !== undefined) list.description = description;

    if (tags !== undefined) {
        let parsedTags = [];

        if (Array.isArray(tags)) {
            parsedTags = tags;
        } else if (typeof tags === "string") {
            try {
                parsedTags = JSON.parse(tags); // handles JSON.stringify([...])
            } catch {
                parsedTags = tags.split(",").map(t => t.trim());
            }
        }

        list.tags = parsedTags.filter(Boolean).map(t => t.trim());
    }

    // Only owner can change visibility
    if (isOwner && isPublic !== undefined) {
        list.isPublic = isPublic;
    }

    await list.save();

    // Always repopulate with latest data
    const populatedList = await TravelListModel.findById(list._id)
        .populate("owner", "-password") // security
        .populate("collaborators", "-password")
        .populate("destinations");

    return {
        success: true,
        message: "Travel list updated successfully",
        data: populatedList
    };
};




// Delete travel list
const deleteTravelList = async (id, userId) => {
    const list = await TravelListModel.findById(id);
    if (!list) return { success: false, message: "Travel list not found" };

    if (list.owner.toString() !== userId)
        return { success: false, message: "Only the owner can delete this list" };

    // Delete cover image from Cloudinary
    if (list.coverImage && list.public_id) {
        await cloudinary.uploader.destroy(list.public_id);
    }

    // Delete all destinations in this list
    await DestinationModel.deleteMany({ listId: list._id });

    // Delete the travel list itself
    await TravelListModel.findByIdAndDelete(list._id);

    return { success: true, message: "Travel list deleted successfully" };
};


// Add collaborator by email
const addCollaborator = async (listId, email, userId) => {
    const list = await TravelListModel.findById(listId);
    if (!list) return { success: false, message: "Travel list not found" };
    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can add collaborators" };

    const collaborator = await UserModel.findOne({ email: email });
    if (!collaborator) return { success: false, message: "User with this email not found" };

    // Check if already a collaborator
    if (list.collaborators.includes(collaborator._id)) {
        return { success: false, message: "User is already a collaborator" };
    }

    // Check if already invited
    const alreadyInvited = collaborator.collaboratorRequests.some(
        req => req.travelList.toString() === list._id.toString() && req.status === 'pending'
    );
    if (alreadyInvited) {
        return { success: false, message: "User already has a pending invitation" };
    }

    // Add a collaborator request
    collaborator.collaboratorRequests.push({
        travelList: list._id,
        fromUser: userId,
    });
    await collaborator.save();

    // Send invitation email
    const owner = await UserModel.findById(userId);
    const inviteLink = `${CLIENT_URL}/requests`;
    await sendCollaboratorInviteEmail(collaborator.email, collaborator.fullName, owner.fullName, list.title, inviteLink);

    return { success: true, message: "Invitation sent successfully" };
};

// Remove collaborator
const removeCollaborator = async (listId, collaboratorId, userId) => {
    const list = await TravelListModel.findById(listId);
    if (!list) return { success: false, message: "Travel list not found" };
    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can remove collaborators" };

    // Remove collaborator
    list.collaborators = list.collaborators.filter(id => id.toString() !== collaboratorId);
    await list.save();

    // Remove pending requests if any
    const collaborator = await UserModel.findById(collaboratorId);
    if (collaborator) {
        collaborator.collaboratorRequests = collaborator.collaboratorRequests.filter(
            req => req.travelList.toString() !== listId.toString()
        );
        await collaborator.save();

        // Send removal email
        const owner = await UserModel.findById(userId);
        await sendCollaboratorRemovedEmail(collaborator.email, collaborator.fullName, list.title, owner.fullName, owner.email);
    }

    // Return populated list
    const populatedList = await TravelListModel.findById(list._id)
        .populate('owner', 'username fullName profileImage')
        .populate('collaborators', 'username fullName profileImage')
        .populate('destinations');

    return { success: true, message: "Collaborator removed successfully", data: populatedList };
};



module.exports = {
    createTravelList,
    getPublicTravelLists,
    getAllLists,
    getUserOwnLists,
    getUserCollaborativeLists,
    getTravelList,
    updateTravelList,
    deleteTravelList,
    addCollaborator,
    removeCollaborator
};
