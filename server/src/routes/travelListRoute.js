const express = require('express');
const router = express.Router();
const travelListController = require('../controllers/travelListController');
const authToken = require('../middlewares/authToken');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const upload = uploadMiddleware("images")

// Public routes
router.get('/public', travelListController.getPublicLists);

// Protected routes
router.use(authToken);

// Create a new travel list
router.post('/', 
    upload.single('coverImage'),
    travelListController.createList
);

// Get user's travel lists
router.get('/user', travelListController.getUserOwnLists);

// Get a single travel list
router.get('/:id', travelListController.getListById);

// Update a travel list
router.patch('/:id',
    upload.single('coverImage'),
    travelListController.updateList
);

// Delete a travel list
router.delete('/:id', travelListController.deleteList);

// Add a collaborator
router.post('/:id/collaborators', travelListController.addCollaboratorToList);

// Remove a collaborator
router.delete('/:id/collaborators', travelListController.removeCollaboratorFromList);

module.exports = router;