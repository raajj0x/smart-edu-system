const Announcement = require('../models/Announcement');

// CREATE Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const ann = new Announcement(req.body);
    await ann.save();
    res.json(ann);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// READ Announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const anns = await Announcement.find().sort({ date: -1 });
    res.json(anns);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// UPDATE Announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const updatedAnn = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAnn);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// DELETE Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Announcement deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};