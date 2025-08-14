const DestinationModel = require('../models/destinationModel');
const TravelListModel = require('../models/travelListModel');
const cloudinary = require("cloudinary").v2;

const createDestination = async (destinationData, files, userId) => {
    const { name, country, datePlanned, status, notes, listId } = destinationData;

    // Check if the travel list exists and user has access
    const travelList = await TravelListModel.findById(listId);
    if (!travelList) {
        throw new Error('Travel list not found');
    }

    // Check if user is owner or collaborator
    if (travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to add destinations to this list');
    }

    let images = [];
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'destinations',
                resource_type: 'auto'
            });
            return {
                url: result.secure_url,
                public_id: result.public_id
            };
        });
        images = await Promise.all(uploadPromises);
    }

    const destination = new DestinationModel({
        name,
        country,
        datePlanned,
        status,
        notes,
        images,
        listId
    });

    await destination.save();

    // Add destination to travel list
    travelList.destinations.push(destination._id);
    await travelList.save();

    return destination;
};

const getDestinationsByList = async (listId, status, userId) => {
    // Check if the travel list exists and user has access
    const travelList = await TravelListModel.findById(listId);
    if (!travelList) {
        throw new Error('Travel list not found');
    }

    // Check if list is public or user has access
    if (!travelList.isPublic && 
        travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to view this list');
    }

    const query = { listId };
    if (status) {
        query.status = status;
    }

    return await DestinationModel.find(query).sort({ datePlanned: 1 });
};

const getDestination = async (id, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) {
        throw new Error('Destination not found');
    }

    // Check if user has access to the related travel list
    const travelList = await TravelListModel.findById(destination.listId);
    if (!travelList.isPublic && 
        travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to view this destination');
    }

    return destination;
};

const updateDestination = async (id, updateData, files, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) {
        throw new Error('Destination not found');
    }

    // Check if user has permission to update
    const travelList = await TravelListModel.findById(destination.listId);
    if (travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to update this destination');
    }

    // Handle new image uploads
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'destinations',
                resource_type: 'auto'
            });
            return {
                url: result.secure_url,
                public_id: result.public_id
            };
        });
        const newImages = await Promise.all(uploadPromises);
        destination.images = [...destination.images, ...newImages];
    }

    // Update fields
    const allowedUpdates = ['name', 'country', 'datePlanned', 'dateVisited', 'status', 'notes'];
    Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .forEach(key => {
            destination[key] = updateData[key];
        });

    return await destination.save();
};

const deleteDestination = async (id, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) {
        throw new Error('Destination not found');
    }

    // Check if user has permission to delete
    const travelList = await TravelListModel.findById(destination.listId);
    if (travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to delete this destination');
    }

    // Delete images from Cloudinary
    if (destination.images.length > 0) {
        const deletePromises = destination.images.map(image => 
            cloudinary.uploader.destroy(image.public_id)
        );
        await Promise.all(deletePromises);
    }

    // Remove destination from travel list
    travelList.destinations = travelList.destinations.filter(
        destId => destId.toString() !== destination._id.toString()
    );
    await travelList.save();

    return await destination.remove();
};

const removeImage = async (id, imageId, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) {
        throw new Error('Destination not found');
    }

    // Check if user has permission
    const travelList = await TravelListModel.findById(destination.listId);
    if (travelList.owner.toString() !== userId && 
        !travelList.collaborators.includes(userId)) {
        throw new Error('Not authorized to modify this destination');
    }

    const image = destination.images.find(img => img.public_id === imageId);
    if (!image) {
        throw new Error('Image not found');
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Remove from destination
    destination.images = destination.images.filter(img => img.public_id !== imageId);
    return await destination.save();
};

module.exports = {
    createDestination,
    getDestinationsByList,
    getDestination,
    updateDestination,
    deleteDestination,
    removeImage
};
