const router = require('express').Router();
const Entry = require('../models/Entry');

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort('-createdAt');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new entry
router.post('/', async (req, res) => {
  const entry = new Entry({
    title: req.body.title,
    location: req.body.location,
    description: req.body.description,
    imageUrl: req.body.imageUrl
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (entry) {
      Object.assign(entry, req.body);
      const updatedEntry = await entry.save();
      res.json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (entry) {
      await entry.deleteOne();
      res.json({ message: 'Entry deleted' });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
