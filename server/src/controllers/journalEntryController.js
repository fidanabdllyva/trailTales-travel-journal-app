const formatMongoData = require('../utils/formatMongoData');
const journalService = require('../services/journalEntryService');

module.exports = {
    async createJournalEntry(req, res) {
        try {
            const entry = await journalService.createJournalEntry(req.body, req.files, req.user.id);
            res.status(201).json(formatMongoData(entry));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getJournalEntries(req, res) {
        try {
            const entries = await journalService.getJournalEntries(req.query);
            res.json(formatMongoData(entries));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getJournalEntryById(req, res) {
        try {
            const entry = await journalService.getJournalEntryById(req.params.id, req.user?.id);
            res.json(formatMongoData(entry));
        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    async updateJournalEntry(req, res) {
        try {
            const entry = await journalService.updateJournalEntry(req.params.id, req.body, req.files, req.user.id);
            res.json(formatMongoData(entry));

        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    async deleteJournalEntry(req, res) {
        try {
            const result = await journalService.deleteJournalEntry(req.params.id, req.user.id);
            res.json(result);
        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    async removePhoto(req, res) {
        try {
            const entry = await journalService.removePhoto(req.params.id, req.body.photoUrl, req.user.id);
            res.json(formatMongoData(entry));
        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    async toggleLike(req, res) {
        try {
            const entry = await journalService.toggleLike(req.params.id, req.user.id);
            res.json(formatMongoData(entry));
        } catch (err) {
            res.status(403).json({ message: err.message });
        }
    },

    async getUserOwnJournalEntry(req,res,next){
         try {
            const userId = req.user.id;
            const journals = await journalService.getUserOwnJournalEntry(userId);

            res.status(200).json({
                message: "User's journals retrieved successfully!",
                data: formatMongoData(journals),
            });
        } catch (error) {
            next(error);
        }
    }
};
