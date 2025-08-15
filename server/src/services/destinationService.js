const DestinationModel = require('../models/destinationModel');
const TravelListModel = require('../models/travelListModel');
const cloudinary = require('cloudinary').v2;

const createDestination = async (destinationData, files, userId) => {
    const { name, country, datePlanned, status, notes, listId } = destinationData;

    let uploadedImages = [];

    try {
        // 1️⃣ Upload images if any
        if (files && files.length > 0) {
            const uploadPromises = files.map(file =>
                cloudinary.uploader.upload(file.path || file, {
                    folder: 'destinations',
                    resource_type: 'auto'
                }).then(res => ({ url: res.secure_url, public_id: res.public_id }))
            );
            uploadedImages = await Promise.all(uploadPromises);
        }

        // 2️⃣ Fetch travel list and check access
        const travelList = await TravelListModel.findById(listId);
        if (!travelList) throw new Error('Travel list not found');

        const normalizedUserId = userId.toString();
        const ownerId = travelList.owner.toString();
        const collaboratorIds = (travelList.collaborators || []).map(c => c.toString());

        if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
            throw new Error('Not authorized to add destinations to this list');
        }

        // 3️⃣ Create new destination
        const destination = new DestinationModel({
            name,
            country,
            datePlanned,
            status: status || 'wishlist',
            notes: notes || '',
            images: uploadedImages,
            listId
        });

        await destination.save();

        // 4️⃣ Add destination to travel list
        travelList.destinations.push(destination._id);
        await travelList.save();

        // 5️⃣ Return populated destination
        const populatedDestination = await DestinationModel.findById(destination._id)
            .populate('listId', 'title owner');

        return { success: true, message: 'Destination created successfully', data: populatedDestination };
    } catch (err) {
        // Clean up uploaded images if save fails
        if (uploadedImages.length > 0) {
            const deletePromises = uploadedImages.map(img => cloudinary.uploader.destroy(img.public_id));
            await Promise.all(deletePromises);
        }
        throw new Error(err.message);
    }
};


const getDestinationsByList = async (listId, status, userId) => {
    const travelList = await TravelListModel.findById(listId)
        .populate('owner', '_id')
        .populate('collaborators', '_id');

    if (!travelList) throw new Error('Travel list not found');

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
    const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));

    if (!travelList.isPublic && ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
        throw new Error('Not authorized to view this list');
    }

    const query = { listId };
    if (status) query.status = status;

    return await DestinationModel.find(query).sort({ datePlanned: 1 });
};

const getDestination = async (id, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) throw new Error('Destination not found');

    const travelList = await TravelListModel.findById(destination.listId)
        .populate('owner', '_id')
        .populate('collaborators', '_id');

    if (!travelList.isPublic) {
        const normalizedUserId = userId.toString();
        const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
        const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));
        if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
            throw new Error('Not authorized to view this destination');
        }
    }

    return destination;
};

const updateDestination = async (id, updateData, files, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) throw new Error('Destination not found');

    const travelList = await TravelListModel.findById(destination.listId)
        .populate('owner', '_id')
        .populate('collaborators', '_id');

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
    const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));

    if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
        throw new Error('Not authorized to update this destination');
    }

    // Upload new images
    if (files && files.length > 0) {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path || file, {
                folder: 'destinations',
                resource_type: 'auto'
            }).then(res => ({ url: res.secure_url, public_id: res.public_id }))
        );
        const newImages = await Promise.all(uploadPromises);
        destination.images = [...destination.images, ...newImages];
    }

    // Update fields
    const allowedUpdates = ['name', 'country', 'datePlanned', 'dateVisited', 'status', 'notes'];
    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) destination[key] = updateData[key];
    });

    await destination.save();
    return destination;
};

const deleteDestination = async (id, userId) => {
    const destination = await DestinationModel.findById(id);
    if (!destination) throw new Error('Destination not found');

    const travelList = await TravelListModel.findById(destination.listId)
        .populate('owner', '_id')
        .populate('collaborators', '_id');

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner._id ? travelList.owner._id.toString() : travelList.owner.toString();
    const collaboratorIds = travelList.collaborators.map(c => (c._id ? c._id.toString() : c.toString()));

    if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
        throw new Error('Not authorized to delete this destination');
    }

    // Delete images from Cloudinary
    if (destination.images.length > 0) {
        const deletePromises = destination.images.map(img => cloudinary.uploader.destroy(img.public_id));
        await Promise.all(deletePromises);
    }

    // Remove destination from travel list
    travelList.destinations = travelList.destinations.filter(d => d.toString() !== id.toString());
    await travelList.save();

    return await destination.deleteOne(); // safer than remove()
};

const removeImage = async (destinationId, imageId, userId) => {
    const destination = await DestinationModel.findById(destinationId);
    if (!destination) throw new Error('Destination not found');

    const travelList = await TravelListModel.findById(destination.listId);
    if (!travelList) throw new Error('Travel list not found');

    const normalizedUserId = userId.toString();
    const ownerId = travelList.owner.toString();
    const collaboratorIds = (travelList.collaborators || []).map(c => c.toString());

    if (ownerId !== normalizedUserId && !collaboratorIds.includes(normalizedUserId)) {
        throw new Error('Not authorized to modify this destination');
    }

    const image = destination.images.find(img => img.public_id === imageId);
    if (!image) throw new Error('Image not found');

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Remove from destination
    destination.images = destination.images.filter(img => img.public_id !== imageId);
    await destination.save();

    return destination;
};

module.exports = {
    createDestination,
    getDestinationsByList,
    getDestination,
    updateDestination,
    deleteDestination,
    removeImage,
};
