const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true 
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profilePic: {
    type: String,
    default: ''
  },
  // 🔥 NEW FIELDS FOR PASSWORD RESET
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // --- Profile Details (Used in the updateUserDetails route) ---
  phone: { type: String, default: '' },
  gender: { type: String, default: '' },
  birthday: { type: String, default: '' },
  school: { type: String, default: '' },
  college: { type: String, default: '' },
  course: { type: String, default: '' },
  department: { type: String, default: '' }

}, { 
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

// 🔥 This exact export format is what fixes your 'User.findOne is not a function' error!
module.exports = mongoose.model('User', UserSchema);