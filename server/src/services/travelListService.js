const TravelListModel = require('../models/travelListModel');
const DestinationModel = require('../models/destinationModel');
const cloudinary = require("cloudinary").v2;
const UserModel = require('../models/userModel'); // for collaborator email lookup

// Create travel list
const createTravelList = async (listData, file, userId) => {
    const { title, description, tags, isPublic } = listData;

    let coverImage = '';
    if (file) {
        const result = await cloudinary.uploader.upload(file.path || file, {
            folder: 'travel_lists',
            resource_type: 'auto'
        });
        coverImage = result.secure_url;
    }

    const travelList = new TravelListModel({
        title,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isPublic: isPublic !== undefined ? isPublic : true,
        owner: userId,
        coverImage
    });

    await travelList.save();

    const populatedList = await TravelListModel.findById(travelList._id)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations');

    return { success: true, message: "Travel list created successfully", data: populatedList };
};

// Get public lists
const getPublicTravelLists = async (page = 1, limit = 10, tag) => {
    const skip = (page - 1) * limit;
    const query = { isPublic: true };
    if (tag) query.tags = tag;

    const lists = await TravelListModel.find(query)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await TravelListModel.countDocuments(query);

    return { lists, totalPages: Math.ceil(total / limit), currentPage: parseInt(page), total };
};

// Get all lists for a user (owner + collaborator)
const getAllLists = async (userId) => {
    const lists = await TravelListModel.find({
        $or: [{ owner: userId }, { collaborators: userId }]
    })
    .populate('owner', 'username avatar')
    .populate('collaborators', 'username avatar')
    .populate('destinations')
    .sort({ createdAt: -1 });

    return lists;
};

// Get user own lists
const getUserOwnLists = async (userId) => {
    return await TravelListModel.find({ owner: userId })
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations')
        .sort({ createdAt: -1 });
};

// Get collaborative lists
const getUserCollaborativeLists = async (userId) => {
    return await TravelListModel.find({ collaborators: userId })
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations')
        .sort({ createdAt: -1 });
};

// Get single list
const getTravelList = async (id, userId) => {
    const list = await TravelListModel.findById(id)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
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
    const list = await TravelListModel.findById(id);
    if (!list) return { success: false, message: "Travel list not found" };

    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can update this list" };

    if (file) {
        if (list.coverImage) {
            const publicId = list.coverImage.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`travel_lists/${publicId}`);
        }
        const result = await cloudinary.uploader.upload(file.path || file, {
            folder: 'travel_lists',
            resource_type: 'auto'
        });
        list.coverImage = result.secure_url;
    }

    const { title, description, tags, isPublic } = updateData;
    if (title) list.title = title;
    if (description) list.description = description;
    if (tags) list.tags = tags.split(',').map(t => t.trim());
    if (isPublic !== undefined) list.isPublic = isPublic;

    await list.save();

    const populatedList = await TravelListModel.findById(list._id)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations');

    return { success: true, message: "Travel list updated successfully", data: populatedList };
};

// Delete travel list
const deleteTravelList = async (id, userId) => {
    const list = await TravelListModel.findById(id);
    if (!list) return { success: false, message: "Travel list not found" };

    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can delete this list" };

    if (list.coverImage) {
        const publicId = list.coverImage.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`travel_lists/${publicId}`);
    }

    await DestinationModel.deleteMany({ listId: list._id });
    await list.remove();

    return { success: true, message: "Travel list deleted successfully" };
};

// Add collaborator by email
const addCollaborator = async (listId, collaboratorEmail, userId) => {
    const list = await TravelListModel.findById(listId);
    if (!list) return { success: false, message: "Travel list not found" };
    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can add collaborators" };

    const collaborator = await UserModel.findOne({ email: collaboratorEmail });
    if (!collaborator) return { success: false, message: "User with this email not found" };

    if (list.collaborators.includes(collaborator._id)) {
        return { success: false, message: "User is already a collaborator" };
    }

    list.collaborators.push(collaborator._id);
    await list.save();

    const populatedList = await TravelListModel.findById(list._id)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
        .populate('destinations');

    return { success: true, message: "Collaborator added successfully", data: populatedList };
};

// Remove collaborator
const removeCollaborator = async (listId, collaboratorId, userId) => {
    const list = await TravelListModel.findById(listId);
    if (!list) return { success: false, message: "Travel list not found" };
    if (list.owner.toString() !== userId) return { success: false, message: "Only the owner can remove collaborators" };

    list.collaborators = list.collaborators.filter(id => id.toString() !== collaboratorId);
    await list.save();

    const populatedList = await TravelListModel.findById(list._id)
        .populate('owner', 'username avatar')
        .populate('collaborators', 'username avatar')
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
