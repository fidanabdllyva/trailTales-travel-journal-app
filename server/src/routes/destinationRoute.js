const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const authToken = require('../middlewares/authToken');
const uploadMiddleware = require('../middlewares/uploadMiddleware')('destinations');

// All routes require authentication
router.use(authToken);

// Create a new destination
router.post('/', 
    uploadMiddleware.array('images', 5), // Allow up to 5 images
    destinationController.createDestination
);

// Get destinations by list ID
router.get('/list/:listId', destinationController.getDestinationsByList);

// Get a single destination
router.get('/:id', destinationController.getDestination);

// Update a destination
router.patch('/:id',
    uploadMiddleware.array('images', 5),
    destinationController.updateDestination
);

// Delete a destination
router.delete('/:id', destinationController.deleteDestination);

// Remove an image from a destination
router.delete('/:id/images', destinationController.removeImage);

module.exports = router;
