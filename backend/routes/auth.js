const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import Middlewares
const { protect, protectAdmin } = require('../middleware/authMiddleware');

// Import the Controller we just made
const authController = require('../controllers/authController');

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, `user-${req.user.id}-${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage });


// ==========================================
// 🛣️ ROUTES MAPPING
// ==========================================

// Public Auth Routes
router.post('/google', authController.googleAuth);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// 🔥 NEW: Password Reset Routes
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resetToken', authController.resetPassword);

// Protected User Routes
router.get('/me', protect, authController.getCurrentUser);
router.put('/updatedetails', protect, upload.single('profilePic'), authController.updateUserDetails);

// Protected Admin Routes
router.get('/users', protectAdmin, authController.getAllUsers);
router.put('/promote/:id', protectAdmin, authController.promoteToTeacher);
router.delete('/user/:id', protectAdmin, authController.deleteUser);

module.exports = router;