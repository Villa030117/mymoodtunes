const express = require('express');
const router = express.Router();
const { 
  getFavorites,
  getStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get user's favorite songs
router.get('/favorites', protect, getFavorites);

// Get user stats (for admin dashboard)
router.get('/stats', protect, getStats);

module.exports = router;
