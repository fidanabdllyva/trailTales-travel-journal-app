const Destination = require('../models/destinationModel');
const TravelList = require('../models/travelListModel');
const formatMongoData = require('../utils/formatMongoData');
const { cloudinary } = require('../config/cloudinaryConfig');

module.exports = {
    // Create a new destination
    async createDestination(req, res) {
        try {
            const { name, country, datePlanned, status, notes, listId } = req.body;
            
            // Check if the travel list exists and user has access
            const travelList = await TravelList.findById(listId);
            if (!travelList) {
                return res.status(404).json({ message: 'Travel list not found' });
            }

            // Check if user is owner or collaborator
            if (travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to add destinations to this list' });
            }

            let images = [];
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(async (file) => {
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

            const destination = new Destination({
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

            res.status(201).json(formatMongoData(destination));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get destinations by list ID
    async getDestinationsByList(req, res) {
        try {
            const { listId } = req.params;
            const { status } = req.query;

            // Check if the travel list exists and user has access
            const travelList = await TravelList.findById(listId);
            if (!travelList) {
                return res.status(404).json({ message: 'Travel list not found' });
            }

            // Check if list is public or user has access
            if (!travelList.isPublic && 
                travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to view this list' });
            }

            const query = { listId };
            if (status) {
                query.status = status;
            }

            const destinations = await Destination.find(query).sort({ datePlanned: 1 });
            res.json(formatMongoData(destinations));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single destination
    async getDestination(req, res) {
        try {
            const destination = await Destination.findById(req.params.id);
            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }

            // Check if user has access to the related travel list
            const travelList = await TravelList.findById(destination.listId);
            if (!travelList.isPublic && 
                travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to view this destination' });
            }

            res.json(formatMongoData(destination));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a destination
    async updateDestination(req, res) {
        try {
            const { name, country, datePlanned, dateVisited, status, notes } = req.body;
            const destination = await Destination.findById(req.params.id);

            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }

            // Check if user has permission to update
            const travelList = await TravelList.findById(destination.listId);
            if (travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to update this destination' });
            }

            // Handle new image uploads
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(async (file) => {
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
            destination.name = name || destination.name;
            destination.country = country || destination.country;
            destination.datePlanned = datePlanned || destination.datePlanned;
            destination.dateVisited = dateVisited || destination.dateVisited;
            destination.status = status || destination.status;
            destination.notes = notes || destination.notes;

            await destination.save();
            res.json(formatMongoData(destination));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a destination
    async deleteDestination(req, res) {
        try {
            const destination = await Destination.findById(req.params.id);
            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }

            // Check if user has permission to delete
            const travelList = await TravelList.findById(destination.listId);
            if (travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to delete this destination' });
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
                id => id.toString() !== destination._id.toString()
            );
            await travelList.save();

            await destination.remove();
            res.json({ message: 'Destination deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Remove an image from a destination
    async removeImage(req, res) {
        try {
            const { imageId } = req.body;
            const destination = await Destination.findById(req.params.id);

            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }

            // Check if user has permission
            const travelList = await TravelList.findById(destination.listId);
            if (travelList.owner.toString() !== req.user._id.toString() && 
                !travelList.collaborators.includes(req.user._id)) {
                return res.status(403).json({ message: 'Not authorized to modify this destination' });
            }

            const image = destination.images.find(img => img.public_id === imageId);
            if (!image) {
                return res.status(404).json({ message: 'Image not found' });
            }

            // Delete from Cloudinary
            await cloudinary.uploader.destroy(image.public_id);

            // Remove from destination
            destination.images = destination.images.filter(img => img.public_id !== imageId);
            await destination.save();

            res.json(formatMongoData(destination));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
