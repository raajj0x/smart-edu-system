// backend/routes/chat.js
const express = require('express');
const router = express.Router();

// 🔥 IMPORT CONTROLLER
const chatController = require('../controllers/chatController');

// ==========================================
// 🛣️ CHAT ROUTES MAPPING
// ==========================================

// Handle AI chat messages
router.post('/message', chatController.sendMessageToAI);

module.exports = router;