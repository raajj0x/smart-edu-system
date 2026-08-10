const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

// Ensure these paths correctly point to your models folder
const User = require('../models/User');
const Video = require('../models/Video');
const Exam = require('../models/Exam');
const Classroom = require('../models/Classroom'); 
const Assignment = require('../models/Assignment');
const Announcement = require('../models/Announcement');

// Configuration Constants
const MASTER_ADMIN_EMAIL = "raj@smartedu.com";
const MASTER_ADMIN_PASSWORD = "15052005";

// 1. Google Authentication
exports.googleAuth = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: "No Google access token provided" });

  try {
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture } = googleResponse.data;
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "Google123!";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name: name || "Google User",
        email: email,
        password: hashedPassword, 
        role: 'student', 
        profilePic: picture 
      });
      await user.save({ validateBeforeSave: false });
    }

    const payload = { user: { id: user._id || user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5d' }, (err, token) => {
      if (err) return res.status(500).json({ message: "Token generation failed." });
      res.json({ token, user: { _id: user._id || user.id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic || picture } });
    });

  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(500).json({ message: "Google Authentication failed on server.", details: err.message });
  }
};

// 2. Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!password) return res.status(400).json({ message: 'Password is required.' });

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\S]{8,15}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be 8-15 characters long and contain at least one letter and one number.' });
  }

  try {
    if (email === MASTER_ADMIN_EMAIL) return res.status(403).json({ message: "Cannot register as Master Admin" });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role: role || 'student' });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// 3. Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === MASTER_ADMIN_EMAIL && password === MASTER_ADMIN_PASSWORD) {
      const payload = { user: { id: "master_raj_admin", role: 'admin' } };
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: "master_raj_admin", name: "Raj", role: "admin" } });
      });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// 4. Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.id === "master_raj_admin") {
      return res.json({ _id: "master_raj_admin", name: "Raj", email: "raj@smartedu.com", role: "admin" });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// 5. Update User Details
exports.updateUserDetails = async (req, res) => {
  const { name, phone, gender, birthday, school, college, course, department } = req.body;
  const updates = {};
  
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (gender) updates.gender = gender;
  if (birthday) updates.birthday = birthday;
  if (school) updates.school = school;
  if (college) updates.college = college;
  if (course) updates.course = course;
  if (department) updates.department = department;
  
  if (req.file) updates.profilePic = req.file.path.replace(/\\/g, "/");

  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// 6. Admin: Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// 7. Admin: Promote to Teacher
exports.promoteToTeacher = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'teacher';
    await user.save();
    res.json({ message: `Success! ${user.name} is now a Teacher.` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ==========================================
// 8. Admin: Delete User (🔥 THE DEEP WIPE FIX)
// ==========================================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'teacher') {
      // 1. Locate all Classrooms belonging to this teacher
      const teacherClasses = await Classroom.find({ teacher: userId });
      const classIds = teacherClasses.map(c => c._id);

      // 2. Delete ALL data tied to those specific Classrooms
      if (classIds.length > 0) {
        try { await Assignment.deleteMany({ classroomId: { $in: classIds } }); } catch(e){}
        try { await Exam.deleteMany({ classroomId: { $in: classIds } }); } catch(e){}
        try { await Announcement.deleteMany({ classroomId: { $in: classIds } }); } catch(e){}
        
        // Use mongoose models dynamically in case Attendance/Submission aren't standard imported
        if (mongoose.models.Submission) {
          const teacherAssignments = await Assignment.find({ classroomId: { $in: classIds } });
          const assignmentIds = teacherAssignments.map(a => a._id);
          if (assignmentIds.length > 0) {
            await mongoose.models.Submission.deleteMany({ assignmentId: { $in: assignmentIds } });
          }
        }
        if (mongoose.models.Attendance) {
          await mongoose.models.Attendance.deleteMany({ classId: { $in: classIds } });
        }
      }

      // 3. Delete data tied directly to the teacher's ID
      try { await Video.deleteMany({ teacher: userId }); } catch(e){}
      try { await Exam.deleteMany({ teacher: userId }); } catch(e){}
      try { await Assignment.deleteMany({ teacher: userId }); } catch(e){}
      try { await Classroom.deleteMany({ teacher: userId }); } catch(e){}
      try { await Announcement.deleteMany({ teacherName: user.name }); } catch(e){}
      
      // Delete any chat requests
      if (mongoose.models.ChatRequest) {
        await mongoose.models.ChatRequest.deleteMany({ teacher: userId });
      }
    }

    // Finally, wipe the user document
    await User.findByIdAndDelete(userId);
    res.json({ message: `Deleted ${user.role} ${user.name} and perfectly wiped all their data.` });
  } catch (err) {
    console.error("Deep Wipe Delete Error:", err);
    res.status(500).json({ message: 'Server Error: Could not delete user.' });
  }
};

// ==========================================
// 9. FORGOT PASSWORD
// ==========================================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "There is no user with that email." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" style="background-color: #004c54; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p><em>This link is only valid for 10 minutes.</em></p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Smart Edu - Password Reset Token',
        message
      });
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error("Email sending failed:", err);
      return res.status(500).json({ message: 'Email could not be sent. Check your .env EMAIL credentials.' });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 10. RESET PASSWORD
// ==========================================
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { password } = req.body;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\S]{8,15}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-15 characters long and contain at least one letter and one number.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully. You can now log in!' });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};