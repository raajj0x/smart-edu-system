// backend/routes/communication.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// 🔥 IMPORT CONTROLLER
const communicationController = require('../controllers/communicationController');

// ==========================================
// 🛣️ COMMUNICATION ROUTES MAPPING
// ==========================================

// Fetch Chat Lists
router.get('/teacher/data', protect, communicationController.getTeacherRequests);
router.get('/student/data', protect, communicationController.getStudentRequests);

// Manage Requests
router.put('/request/:id', protect, communicationController.updateRequestStatus);
router.delete('/request/:id', protect, communicationController.deleteRequest);

// Messaging
router.get('/messages/:requestId', protect, communicationController.getMessages);
router.post('/message', protect, communicationController.sendMessage);

module.exports = router;