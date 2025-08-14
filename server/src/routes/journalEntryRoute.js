const express = require('express');
const router = express.Router();
const journalEntryController = require('../controllers/journalEntryController');
const authToken = require('../middlewares/authToken');
const uploadMiddleware = require('../middlewares/uploadMiddleware')('journals');

// Public routes
router.get('/public', journalEntryController.getJournalEntries);

// Protected routes
router.use(authToken);

// Create a new journal entry
router.post('/', 
    uploadMiddleware.array('photos', 10), // Allow up to 10 photos
    journalEntryController.createJournalEntry
);

// Get all journal entries (with filters)
router.get('/', journalEntryController.getJournalEntries);

// Get a single journal entry
router.get('/:id', journalEntryController.getJournalEntryById);

// Update a journal entry
router.patch('/:id',
    uploadMiddleware.array('photos', 10),
    journalEntryController.updateJournalEntry
);

// Delete a journal entry
router.delete('/:id', journalEntryController.deleteJournalEntry);

// Remove a photo from a journal entry
router.delete('/:id/photos', journalEntryController.removePhoto);

// Toggle like on a journal entry
router.post('/:id/toggle-like', journalEntryController.toggleLike);

module.exports = router;
