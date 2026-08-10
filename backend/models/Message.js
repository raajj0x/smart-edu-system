const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRequest', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);