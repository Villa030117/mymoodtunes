const express = require('express');
const router = express.Router();
const { 
  getUserPlaylists, 
  getPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  addToPlaylist, 
  removeFromPlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Get all playlists for the logged-in user
router.get('/', protect, getUserPlaylists);

// Get a specific playlist
router.get('/:id', protect, getPlaylistById);

// Create a new playlist
router.post(
  '/', 
  protect, 
  uploadMiddleware.single('playlistImage'), 
  createPlaylist
);

// Update a playlist
router.put(
  '/:id', 
  protect, 
  uploadMiddleware.single('playlistImage'), 
  updatePlaylist
);

// Delete a playlist
router.delete('/:id', protect, deletePlaylist);

// Add a song to a playlist
router.post('/:id/songs/:songId', protect, addToPlaylist);

// Remove a song from a playlist
router.delete('/:id/songs/:songId', protect, removeFromPlaylist);

module.exports = router;
