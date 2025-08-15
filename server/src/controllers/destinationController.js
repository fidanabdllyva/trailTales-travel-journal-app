const destinationService = require('../services/destinationService');
const formatMongoData = require('../utils/formatMongoData');

module.exports = {
    async createDestination(req, res) {
        try {
            const destination = await destinationService.createDestination(req.body, req.files, req.user.id);
            res.status(201).json(formatMongoData(destination));
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async getDestinationsByList(req, res) {
        try {
            const destinations = await destinationService.getDestinationsByList(req.params.listId, req.query.status, req.user.id);
            res.json(formatMongoData(destinations));
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async getDestination(req, res) {
        try {
            const destination = await destinationService.getDestination(req.params.id, req.user.id);
            res.json(formatMongoData(destination));
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async updateDestination(req, res) {
        try {
            const destination = await destinationService.updateDestination(req.params.id, req.body, req.files, req.user.id);
            res.json(formatMongoData(destination));
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async deleteDestination(req, res) {
        try {
            await destinationService.deleteDestination(req.params.id, req.user.id);
            res.json({ success: true, message: 'Destination deleted successfully' });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

         async removeImage(req, res) {
        try {
            const { imageId } = req.body;
            const destination = await destinationService.removeImage(req.params.id, imageId, req.user.id);
            res.json({
                success: true,
                message: 'Image removed successfully',
                data: formatMongoData(destination)
            });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};
