const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { protect } = require('../middleware/authMiddleware');

// 🔥 IMPORT CONTROLLER
const studentController = require('../controllers/studentController');

// --- MULTER CONFIG (File Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, 'submission-' + Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// ==========================================
// 🛣️ STUDENT ROUTES MAPPING
// ==========================================

// Classes & Content
router.get('/all-classes', protect, studentController.getAllClasses);
router.get('/my-classes', protect, studentController.getMyClasses);
router.post('/join-class/:classId', protect, studentController.joinClass);
router.get('/content/:teacherId', protect, studentController.getClassContent);

// Attendance
router.get('/my-attendance', protect, studentController.getMyAttendance);

// Communication
router.post('/chat-request', protect, studentController.requestChat);

// Exams
router.get('/exams', protect, studentController.getExams);
router.post('/submit-exam', protect, studentController.submitExam);

// Assignments & Submissions
router.get('/my-submissions', protect, studentController.getMySubmissions);
router.delete('/delete-submission/:id', protect, studentController.deleteSubmission);
router.post('/submit-assignment', protect, upload.single('file'), studentController.submitAssignment);

module.exports = router;