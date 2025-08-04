const journalEntrySchema = require('../schemas/journalEntrySchema');
const mongoose = require('mongoose');

const JournalEntryModel = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntryModel;