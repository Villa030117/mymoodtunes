const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware, isAdmin);

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// User logs
router.get('/logs', adminController.getUserLogs);

// Favorites management
router.get('/favorites', adminController.getAllFavorites);
router.delete('/favorites/:favoriteId', adminController.deleteFavorite);

// Playlists management
router.get('/playlists', adminController.getAllPlaylists);
router.delete('/playlists/:playlistId', adminController.deletePlaylist);

module.exports = router;
