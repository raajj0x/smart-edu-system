const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  message: String,
  classroomId: String,
  className: String,
  teacherName: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);