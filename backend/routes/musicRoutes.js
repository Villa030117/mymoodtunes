const express = require('express');
const router = express.Router();
const { 
  getAllMusic, 
  getMusicById, 
  getByCategory,
  searchMusic,
  toggleFavorite
} = require('../controllers/musicController');
const { 
  createMusic, 
  updateMusic, 
  deleteMusic 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllMusic);
router.get('/category/:category', getByCategory);
router.get('/search', searchMusic);
router.get('/:id', getMusicById);

// Protected routes for users
router.post('/favorite/:id', protect, toggleFavorite);

// Admin routes
router.post(
  '/', 
  protect, 
  adminOnly, 
  uploadMiddleware.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), 
  createMusic
);

router.put(
  '/:id', 
  protect, 
  adminOnly, 
  uploadMiddleware.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), 
  updateMusic
);

router.delete('/:id', protect, adminOnly, deleteMusic);

module.exports = router;
