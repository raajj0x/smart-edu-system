// 1. MUST BE THE VERY FIRST LINE
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const path = require('path'); // 🔥 NEW: Required for serving frontend files

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// --- CONNECT DB ---
console.log("👀 Checking MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ==========================================
// 🛣️ ROUTES
// ==========================================
app.use('/api/auth', require('./routes/auth'));           
app.use('/api/teacher', require('./routes/teacher'));     
app.use('/api/student', require('./routes/student'));     
app.use('/api/chat', require('./routes/chat'));      
app.use('/api/communication', require('./routes/communication')); 
app.use('/api/announcements', require('./routes/announcement'));

// ==========================================
// 🔥 SERVE REACT FRONTEND
// ==========================================
// Serve static files from 'public' inside backend
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to hand over routing to React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// 🔌 WEBSOCKET (SOCKET.IO) SETUP
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"] 
  }
});

const activeLiveRooms = new Map(); 

io.on("connection", (socket) => {
  console.log(`🔌 User Connected: ${socket.id}`);

  socket.emit("active_rooms_update", Array.from(activeLiveRooms.keys()));

  socket.on("join_chat", (chatRequestId) => socket.join(chatRequestId));
  socket.on("send_message", (data) => socket.to(data.chatRequestId).emit("receive_message", data.message));

  socket.on("new_announcement", (data) => socket.broadcast.emit("announcement_received", data));
  socket.on("notify_live_class", (data) => socket.broadcast.emit("live_class_started", data));

  socket.on("start_live_class", (data) => {
    activeLiveRooms.set(data.roomId, socket.id);
    io.emit("active_rooms_update", Array.from(activeLiveRooms.keys()));
  });

  socket.on("end_live_class", (roomId) => {
    activeLiveRooms.delete(roomId);
    io.emit("active_rooms_update", Array.from(activeLiveRooms.keys()));
    io.emit("force_end_class", roomId); 
  });

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
    for (const [roomId, teacherSocketId] of activeLiveRooms.entries()) {
      if (teacherSocketId === socket.id) {
        activeLiveRooms.delete(roomId);
        io.emit("active_rooms_update", Array.from(activeLiveRooms.keys()));
        io.emit("force_end_class", roomId); 
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));