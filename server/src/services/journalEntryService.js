const JournalEntry = require('../models/journalEntryModel');
const cloudinary = require("cloudinary").v2;

const createJournalEntry = async (entryData, files, userId) => {
    const { title, content, destination, public } = entryData;
    let photos = [];

    // Handle multiple photo uploads
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
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
        author: userId,
        public: public || false
    });

    await journalEntry.save();
    
    return await JournalEntry.findById(journalEntry._id)
        .populate('author', 'username avatar')
        .populate('destination', 'name location')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username avatar'
            }
        });
};

const getJournalEntries = async (params = {}) => {
    const { destination, author, public, page = 1, limit = 10 } = params;
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

    return {
        entries,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};

const getJournalEntryById = async (id, userId) => {
    const entry = await JournalEntry.findById(id)
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
        throw new Error('Journal entry not found');
    }

    // Check if the entry is private and the user is not the author
    if (!entry.public && (!userId || entry.author._id.toString() !== userId)) {
        throw new Error('Access denied to private journal entry');
    }

    return entry;
};

const updateJournalEntry = async (id, updateData, files, userId) => {
    const { title, content, public } = updateData;
    const entry = await JournalEntry.findById(id);

    if (!entry) {
        throw new Error('Journal entry not found');
    }

    // Check if the user is the author
    if (entry.author.toString() !== userId) {
        throw new Error('Not authorized to update this entry');
    }

    // Handle new photo uploads
    if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
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

    return await JournalEntry.findById(entry._id)
        .populate('author', 'username avatar')
        .populate('destination', 'name location')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username avatar'
            }
        });
};

const deleteJournalEntry = async (id, userId) => {
    const entry = await JournalEntry.findById(id);

    if (!entry) {
        throw new Error('Journal entry not found');
    }

    // Check if the user is the author
    if (entry.author.toString() !== userId) {
        throw new Error('Not authorized to delete this entry');
    }

    // Delete photos from Cloudinary
    if (entry.photos.length > 0) {
        const deletePromises = entry.photos.map(async (photoUrl) => {
            const publicId = photoUrl.split('/').slice(-1)[0].split('.')[0];
            return cloudinary.uploader.destroy(`journal_entries/${publicId}`);
        });
        await Promise.all(deletePromises);
    }

    await entry.remove();
    return { message: 'Journal entry deleted successfully' };
};

const removePhoto = async (id, photoUrl, userId) => {
    const entry = await JournalEntry.findById(id);

    if (!entry) {
        throw new Error('Journal entry not found');
    }

    // Check if the user is the author
    if (entry.author.toString() !== userId) {
        throw new Error('Not authorized to modify this entry');
    }

    // Remove photo from Cloudinary
    const publicId = photoUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`journal_entries/${publicId}`);

    // Remove photo URL from entry
    entry.photos = entry.photos.filter(url => url !== photoUrl);
    await entry.save();

    return entry;
};

const toggleLike = async (entryId, userId) => {
    const entry = await JournalEntry.findById(entryId);

    if (!entry) {
        throw new Error('Journal entry not found');
    }

    const likeIndex = entry.likes.findIndex(
        like => like.userId.toString() === userId
    );

    if (likeIndex === -1) {
        // Add like
        entry.likes.push({ userId });
    } else {
        // Remove like
        entry.likes.splice(likeIndex, 1);
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
