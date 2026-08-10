const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================
// 🛡️ PROTECT: Verify User is Logged In
// ==========================================
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Handle Master Admin Bypass
      if (decoded.user.id === "master_raj_admin") {
        req.user = { id: "master_raj_admin", role: "admin" };
        return next();
      }

      // Get user from the token payload (exclude the password for security)
      req.user = await User.findById(decoded.user.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // ➡️ Move on to the Controller
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ==========================================
// 👑 PROTECT ADMIN: Verify User is an Admin
// ==========================================
const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Handle Master Admin Bypass
      if (decoded.user.id === "master_raj_admin") {
        req.user = { id: "master_raj_admin", role: "admin" };
        return next();
      }

      // Fetch fresh user data
      req.user = await User.findById(decoded.user.id).select('-password');
      
      // ➡️ Check Role BEFORE moving to the Controller
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect, protectAdmin };