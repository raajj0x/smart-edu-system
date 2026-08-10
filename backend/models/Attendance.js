const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);