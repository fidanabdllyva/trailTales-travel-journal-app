const DestinationModel = require("../models/destinationModel");
const TravelListModel = require("../models/travelListModel");
const cloudinary = require("cloudinary").v2;

const createDestination = async (destinationData, files, userId) => {
  const { country, city, datePlanned, dateVisited, status, notes, listId } = destinationData;
  let uploadedImage = null;

  try {
    // 1️⃣ Upload single image if provided
    if (files && files.length > 0) {
      const file = files[0];
      const res = await cloudinary.uploader.upload(file.path || file, {
        folder: "destinations",
        resource_type: "auto"
      });
      uploadedImage = { url: res.secure_url, public_id: res.public_id };
    }

    // 2️⃣ Fetch travel list & check access
    const travelList = await TravelListModel.findById(listId);
    if (!travelList) throw new Error("Travel list not found");

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner.toString();
    const collaboratorIds = (travelList.collaborators || []).map(c => c.toString());

    if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
      throw new Error("Not authorized to add destinations to this list");
    }

    // 3️⃣ Create new destination
    const destination = new DestinationModel({
      location: { country, city },
      datePlanned,
      dateVisited: dateVisited || null,
      status: status || "wishlist",
      notes: notes || "",
      image: uploadedImage,
      listId
    });

    await destination.save();

    // 4️⃣ Add to travel list
    travelList.destinations.push(destination._id);
    await travelList.save();

    // 5️⃣ Return populated destination
    const populatedDestination = await DestinationModel.findById(destination._id)
      .populate("listId", "title owner");

    return { success: true, message: "Destination created successfully", data: populatedDestination };
  } catch (err) {
    // Clean up uploaded image if save fails
    if (uploadedImage) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    throw new Error(err.message);
  }
};

const updateDestination = async (id, updateData, files, userId) => {
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
  if (files && files.length > 0) {
    // delete old image from Cloudinary
    if (destination.image && destination.image.public_id) {
      await cloudinary.uploader.destroy(destination.image.public_id);
    }

    const file = files[0];
    const res = await cloudinary.uploader.upload(file.path || file, {
      folder: "destinations",
      resource_type: "auto"
    });
    destination.image = { url: res.secure_url, public_id: res.public_id };
  }

  // 2️⃣ Update allowed fields
  const allowedUpdates = ["location", "datePlanned", "dateVisited", "status", "notes"];
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      if (key === "location" && typeof updateData[key] === "object") {
        destination.location.country = updateData.location.country || destination.location.country;
        destination.location.city = updateData.location.city || destination.location.city;
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

  // Delete image from Cloudinary
  if (destination.image && destination.image.public_id) {
    await cloudinary.uploader.destroy(destination.image.public_id);
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

  if (destination.image && destination.image.public_id) {
    await cloudinary.uploader.destroy(destination.image.public_id);
  }

  destination.image = null;
  await destination.save();

  return destination;
};

module.exports = {
  createDestination,
  getDestinationsByList: async (listId, status, userId) => {
    const query = { listId };
    if (status) query.status = status;
    return await DestinationModel.find(query).sort({ datePlanned: 1 });
  },
  getDestination: async (id, userId) => DestinationModel.findById(id),
  updateDestination,
  deleteDestination,
  removeImage
};
