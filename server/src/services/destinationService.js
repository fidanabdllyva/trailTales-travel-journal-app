const DestinationModel = require("../models/destinationModel");
const TravelListModel = require("../models/travelListModel");
const cloudinary = require("cloudinary").v2;

const createDestination = async (destinationData, file, userId) => {
  const { country, city, datePlanned, dateVisited, status, notes, listId, rating } = destinationData;
  let image = '';
  let public_id = '';

  try {
    if (file) {
      const res = await cloudinary.uploader.upload(file.path || file, {
        folder: "destinations",
        resource_type: "auto",
      });
      image = res.secure_url;
      public_id = res.public_id;
    }

    const travelList = await TravelListModel.findById(listId);
    if (!travelList) throw new Error("Travel list not found");

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner.toString();
    const collaboratorIds = (travelList.collaborators || []).map(c => c.toString());

    if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
      throw new Error("Not authorized to add destinations to this list");
    }

    const destination = new DestinationModel({
      location: { country, city },
      datePlanned,
      dateVisited: dateVisited || null,
      status: status || "wishlist",
      notes: notes || "",
      image,
      public_id,
      listId,
      rating: status === "completed" ? rating : undefined
    });

    await destination.save();

    // Push destination ID into travel list
    travelList.destinations.push(destination._id);
    await travelList.save();

    // Populate list with destinations before returning
    const populatedDestination = await DestinationModel.findById(destination._id)
      .populate("listId", "title owner");

    return { success: true, message: "Destination created successfully", data: populatedDestination };
  } catch (err) {
    if (public_id) await cloudinary.uploader.destroy(public_id);
    throw new Error(err.message);
  }
};


const updateDestination = async (id, updateData, file, userId) => {
  const destination = await DestinationModel.findById(id);
  if (!destination) throw new Error("Destination not found");

  const travelList = await TravelListModel.findById(destination.listId)
    .populate("owner", "_id")
    .populate("collaborators", "_id");

  const normalizedUserId = userId.toString();
  const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
  const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));

  if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
    throw new Error("Not authorized to update this destination");
  }

  // 1️⃣ Replace image if new one provided
  if (file) {
    if (destination.image) {
      await cloudinary.uploader.destroy(destination.public_id);
    }

    const res = await cloudinary.uploader.upload(file.path || file, {
      folder: "destinations",
      resource_type: "auto",
    });
    destination.image = res.secure_url;
    destination.public_id = res.public_id;

  }

  const allowedUpdates = ["location", "datePlanned", "dateVisited", "status", "notes", "rating"];
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      if (key === "location" && typeof updateData[key] === "object") {
        destination.location.country = updateData.location.country || destination.location.country;
        destination.location.city = updateData.location.city || destination.location.city;
      } else if (key === "rating") {
        if (destination.status === "completed") {
          destination.rating = updateData.rating;
        }
      } else {
        destination[key] = updateData[key];
      }
    }
  });


  await destination.save();
  return destination;
};

const deleteDestination = async (id, userId) => {
  const destination = await DestinationModel.findById(id);
  if (!destination) throw new Error("Destination not found");

  const travelList = await TravelListModel.findById(destination.listId)
    .populate("owner", "_id")
    .populate("collaborators", "_id");

  const normalizedUserId = userId.toString();
  const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
  const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));

  if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
    throw new Error("Not authorized to delete this destination");
  }

  // Delete image from Cloudinary if exists
  if (destination.image && destination.public_id) {
    await cloudinary.uploader.destroy(destination.public_id);
  }

  // Remove destination from travel list
  travelList.destinations = travelList.destinations.filter(d => d.toString() !== id.toString());
  await travelList.save();

  return await destination.deleteOne();
};

const removeImage = async (destinationId, userId) => {
  const destination = await DestinationModel.findById(destinationId);
  if (!destination) throw new Error("Destination not found");

  const travelList = await TravelListModel.findById(destination.listId);
  if (!travelList) throw new Error("Travel list not found");

  const normalizedUserId = userId.toString();
  const ownerId = travelList.owner.toString();
  const collaboratorIds = (travelList.collaborators || []).map(c => c.toString());

  if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
    throw new Error("Not authorized to modify this destination");
  }

  if (destination.image && destination.public_id) {
    await cloudinary.uploader.destroy(destination.public_id);
  }
  destination.image = null;
  destination.public_id = null;
  await destination.save();

  return destination;
};

module.exports = {
  createDestination,
  getDestinationsByList: async (listId, status) => {
    const query = { listId };
    if (status) query.status = status;
    return await DestinationModel.find(query).sort({ datePlanned: 1 });
  },
  getDestination: async (id) => DestinationModel.findById(id),
  updateDestination,
  deleteDestination,
  removeImage,
};
