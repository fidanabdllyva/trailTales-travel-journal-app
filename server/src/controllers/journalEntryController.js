const JournalEntry = require('../models/journalEntryModel');
const formatMongoData = require('../utils/formatMongoData');
const { cloudinary } = require('../config/cloudinaryConfig');

module.exports = {
    // Create a new journal entry
    async createJournalEntry(req, res) {
        try {
            const { title, content, destination, public } = req.body;
            let photos = [];

            // Handle multiple photo uploads
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'journal_entries',
                        resource_type: 'auto'
                    });
                    return result.secure_url;
                });
                photos = await Promise.all(uploadPromises);
            }

            const journalEntry = new JournalEntry({
                title,
                content,
                photos,
                destination,
                author: req.user._id,
                public: public || false
            });

            await journalEntry.save();
            
            const populatedEntry = await JournalEntry.findById(journalEntry._id)
                .populate('author', 'username avatar')
                .populate('destination', 'name location')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        select: 'username avatar'
                    }
                });

            res.status(201).json(formatMongoData(populatedEntry));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all journal entries (with filters)
    async getJournalEntries(req, res) {
        try {
            const { destination, author, public, page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            
            const query = {};
            if (destination) query.destination = destination;
            if (author) query.author = author;
            if (public !== undefined) query.public = public;

            const entries = await JournalEntry.find(query)
                .populate('author', 'username avatar')
                .populate('destination', 'name location')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        select: 'username avatar'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await JournalEntry.countDocuments(query);

            res.json({
                entries: formatMongoData(entries),
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single journal entry by ID
    async getJournalEntryById(req, res) {
        try {
            const entry = await JournalEntry.findById(req.params.id)
                .populate('author', 'username avatar')
                .populate('destination', 'name location')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        select: 'username avatar'
                    }
                });

            if (!entry) {
                return res.status(404).json({ message: 'Journal entry not found' });
            }

            // Check if the entry is private and the user is not the author
            if (!entry.public && (!req.user || entry.author._id.toString() !== req.user._id.toString())) {
                return res.status(403).json({ message: 'Access denied to private journal entry' });
            }

            res.json(formatMongoData(entry));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a journal entry
    async updateJournalEntry(req, res) {
        try {
            const { title, content, public } = req.body;
            const entry = await JournalEntry.findById(req.params.id);

            if (!entry) {
                return res.status(404).json({ message: 'Journal entry not found' });
            }

            // Check if the user is the author
            if (entry.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this entry' });
            }

            // Handle new photo uploads
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'journal_entries',
                        resource_type: 'auto'
                    });
                    return result.secure_url;
                });
                const newPhotos = await Promise.all(uploadPromises);
                entry.photos = [...entry.photos, ...newPhotos];
            }

            // Update fields
            entry.title = title || entry.title;
            entry.content = content || entry.content;
            if (public !== undefined) entry.public = public;

            await entry.save();

            const updatedEntry = await JournalEntry.findById(entry._id)
                .populate('author', 'username avatar')
                .populate('destination', 'name location')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        select: 'username avatar'
                    }
                });

            res.json(formatMongoData(updatedEntry));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a journal entry
    async deleteJournalEntry(req, res) {
        try {
            const entry = await JournalEntry.findById(req.params.id);

            if (!entry) {
                return res.status(404).json({ message: 'Journal entry not found' });
            }

            // Check if the user is the author
            if (entry.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this entry' });
            }

            // Delete photos from Cloudinary
            if (entry.photos.length > 0) {
                const deletePromises = entry.photos.map(async (photoUrl) => {
                    // Extract public_id from the URL
                    const publicId = photoUrl.split('/').slice(-1)[0].split('.')[0];
                    return cloudinary.uploader.destroy(`journal_entries/${publicId}`);
                });
                await Promise.all(deletePromises);
            }

            await entry.remove();
            res.json({ message: 'Journal entry deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Remove a specific photo from a journal entry
    async removePhoto(req, res) {
        try {
            const { photoUrl } = req.body;
            const entry = await JournalEntry.findById(req.params.id);

            if (!entry) {
                return res.status(404).json({ message: 'Journal entry not found' });
            }

            // Check if the user is the author
            if (entry.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to modify this entry' });
            }

            // Remove photo from Cloudinary
            const publicId = photoUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`journal_entries/${publicId}`);

            // Remove photo URL from entry
            entry.photos = entry.photos.filter(url => url !== photoUrl);
            await entry.save();

            res.json(formatMongoData(entry));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Toggle like on a journal entry
    async toggleLike(req, res) {
        try {
            const entry = await JournalEntry.findById(req.params.id);

            if (!entry) {
                return res.status(404).json({ message: 'Journal entry not found' });
            }

            const likeIndex = entry.likes.findIndex(
                like => like.userId.toString() === req.user._id.toString()
            );

            if (likeIndex === -1) {
                // Add like
                entry.likes.push({ userId: req.user._id });
            } else {
                // Remove like
                entry.likes.splice(likeIndex, 1);
            }

            await entry.save();
            res.json(formatMongoData(entry));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
