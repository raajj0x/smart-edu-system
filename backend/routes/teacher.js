// backend/routes/teacher.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');

// 🔥 IMPORT CONTROLLER
const teacherController = require('../controllers/teacherController');

// --- MULTER CONFIG (File Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// ==========================================
// 🛣️ TEACHER ROUTES MAPPING
// ==========================================

// Classrooms
router.post('/create-class', protect, teacherController.createClass);
router.get('/classes', protect, teacherController.getClasses);
router.delete('/class/:id', protect, teacherController.deleteClass);

// Assignments
router.post('/assignment', protect, upload.single('file'), teacherController.createAssignment);
router.put('/assignment/:id', protect, upload.single('file'), teacherController.updateAssignment);
router.get('/assignments', protect, teacherController.getAssignments);
router.delete('/assignment/:id', protect, teacherController.deleteAssignment);

// Videos
router.post('/video', protect, upload.single('file'), teacherController.uploadVideo);
router.get('/videos', protect, teacherController.getVideos);
router.delete('/video/:id', protect, teacherController.deleteVideo);

// Students & Attendance
router.get('/class-students/:classId', protect, teacherController.getClassStudents);
router.get('/my-students', protect, teacherController.getMyStudents);
router.post('/attendance', protect, teacherController.markAttendance);

// Exams
router.post('/exam', protect, teacherController.createExam);
router.get('/exams', protect, teacherController.getExams);
router.delete('/exam/:id', protect, teacherController.deleteExam);
router.get('/exam-results/:examId', protect, teacherController.getExamResults);

// Submissions & Grading
router.get('/assignment/:id/submissions', protect, teacherController.getAssignmentSubmissions);
router.put('/submission/:id/evaluate', protect, teacherController.evaluateSubmission);
// (Note: I merged your duplicate '/grade' and '/evaluate' routes into just '/evaluate' to keep it clean)

module.exports = router;