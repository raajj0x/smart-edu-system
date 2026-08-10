// backend/controllers/communicationController.js
const ChatRequest = require('../models/ChatRequest');
const Message = require('../models/Message');

// ==========================================
// 1. FETCH CHAT LISTS
// ==========================================

// Get Teacher's Chat Requests
exports.getTeacherRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.find({ teacher: req.user.id })
      .populate('student', 'name email') 
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

// Get Student's Chat Requests
exports.getStudentRequests = async (req, res) => {
  try {
    const requests = await ChatRequest.find({ student: req.user.id })
      .populate('teacher', 'name email') 
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

// ==========================================
// 2. MANAGE REQUESTS
// ==========================================

// Accept / Reject Request
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body; 
  try {
    const request = await ChatRequest.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { returnDocument: 'after' } 
    );
    res.json(request);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

// ==========================================
// 3. MESSAGING
// ==========================================

// Get Messages for a specific chat
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatRequestId: req.params.requestId })
      .sort({ timestamp: 1 }); // Oldest first
    res.json(messages);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { chatRequestId, content } = req.body;
  try {
    const newMessage = new Message({ 
      chatRequestId, 
      sender: req.user.id, 
      content 
    });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

// ==========================================
// 4. DELETE REQUESTS & MESSAGES
// ==========================================

// Permanently delete a chat request & its messages
exports.deleteRequest = async (req, res) => {
  try {
    // 1. Find the request by the ID sent from the frontend and delete it
    const deletedRequest = await ChatRequest.findByIdAndDelete(req.params.id);
    
    if (!deletedRequest) {
      return res.status(404).json({ msg: "Chat request not found" });
    }

    // 2. Also delete all messages associated with this chat
    await Message.deleteMany({ chatRequestId: req.params.id });

    res.json({ msg: "Chat request permanently deleted!" });
  } catch (err) {
    console.error("Error deleting chat request:", err);
    res.status(500).json({ msg: "Server error while deleting." });
  }
};