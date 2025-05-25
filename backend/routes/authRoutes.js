const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getCurrentUser,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Logout user
router.get('/logout', protect, logout);

// Get current user profile
router.get('/me', protect, getCurrentUser);

// Update user profile
router.put(
  '/update-profile', 
  protect, 
  uploadMiddleware.single('profileImage'), 
  updateProfile
);

module.exports = router;
