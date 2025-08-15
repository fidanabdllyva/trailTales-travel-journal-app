const JournalEntry = require('../models/journalEntryModel');
const Comment = require('../models/commentModel');
const cloudinary = require("cloudinary").v2;

const createJournalEntry = async (entryData, files, userId) => {
    const { title, content, destination, public: isPublic } = entryData;
    let photos = [];

    // Upload photos
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path || file, {
                folder: 'journal_entries',
                resource_type: 'auto'
            });
            return { url: result.secure_url, public_id: result.public_id };
        });
        photos = await Promise.all(uploadPromises);
    }

    const journalEntry = new JournalEntry({
        title,
        content,
        photos,
        destination,
        author: userId,
        public: isPublic || false
    });

    await journalEntry.save();

    // Populate references
    const populatedEntry = await JournalEntry.findById(journalEntry._id)
        .populate('author', 'username fullName profileImage')
        .populate('destination', 'name country')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username fullName profileImage'
            }
        });

    return populatedEntry;
};

const getJournalEntries = async (params = {}) => {
    const { destination, author, public: isPublic, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const query = {};
    if (destination) query.destination = destination;
    if (author) query.author = author;
    if (isPublic !== undefined) query.public = isPublic;

    const entries = await JournalEntry.find(query)
        .populate('author', 'username fullName profileImage')
        .populate('destination', 'name country')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username fullName profileImage'
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await JournalEntry.countDocuments(query);

    return {
        entries,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};

const getJournalEntryById = async (id, userId) => {
    const entry = await JournalEntry.findById(id)
        .populate('author', 'username fullName profileImage')
        .populate('destination', 'name country')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username fullName profileImage'
            }
        });

    if (!entry) throw new Error('Journal entry not found');

    // Access check for private entries
    if (!entry.public && (!userId || entry.author._id.toString() !== userId.toString())) {
        throw new Error('Access denied');
    }

    return entry;
};

const updateJournalEntry = async (id, updateData, files, userId) => {
    const { title, content, public: isPublic } = updateData;
    const entry = await JournalEntry.findById(id);

    if (!entry) throw new Error('Journal entry not found');
    if (entry.author.toString() !== userId.toString()) throw new Error('Not authorized');

    // Handle new photos
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path || file, {
                folder: 'journal_entries',
                resource_type: 'auto'
            });
            return { url: result.secure_url, public_id: result.public_id };
        });
        const newPhotos = await Promise.all(uploadPromises);
        entry.photos = [...entry.photos, ...newPhotos];
    }

    // Update fields
    entry.title = title || entry.title;
    entry.content = content || entry.content;
    if (isPublic !== undefined) entry.public = isPublic;

    await entry.save();

    return await getJournalEntryById(entry._id, userId);
};

const deleteJournalEntry = async (id, userId) => {
    const entry = await JournalEntry.findById(id);

    if (!entry) throw new Error('Journal entry not found');
    if (entry.author.toString() !== userId.toString()) throw new Error('Not authorized');

    // Delete photos from Cloudinary
    if (entry.photos.length > 0) {
        const deletePromises = entry.photos.map(photo => cloudinary.uploader.destroy(photo.public_id));
        await Promise.all(deletePromises);
    }

    await entry.deleteOne();
    return { message: 'Journal entry deleted successfully' };
};

const removePhoto = async (id, photoUrl, userId) => {
    const entry = await JournalEntry.findById(id);
    if (!entry) throw new Error('Journal entry not found');
    if (entry.author.toString() !== userId.toString()) throw new Error('Not authorized');

    const photoToRemove = entry.photos.find(p => p.url === photoUrl);
    if (!photoToRemove) throw new Error('Photo not found');

    await cloudinary.uploader.destroy(photoToRemove.public_id);
    entry.photos = entry.photos.filter(p => p.url !== photoUrl);
    await entry.save();

    return entry;
};

const toggleLike = async (entryId, userId) => {
    const entry = await JournalEntry.findById(entryId);
    if (!entry) throw new Error('Journal entry not found');

    const index = entry.likes.findIndex(like => like.userId.toString() === userId.toString());
    if (index === -1) {
        entry.likes.push({ userId });
    } else {
        entry.likes.splice(index, 1);
    }

    await entry.save();
    return entry;
};

module.exports = {
    createJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry,
    removePhoto,
    toggleLike
};
