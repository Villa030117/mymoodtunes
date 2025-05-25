const Playlist = require('../models/Playlist');
const UserLog = require('../models/UserLog');
const fs = require('fs');
const path = require('path');

// Get user playlists
exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await Playlist.findByUserId(userId);
    res.json(playlists);
  } catch (error) {
    console.error('Get user playlists error:', error);
    res.status(500).json({ message: 'Server error while fetching playlists' });
  }
};

// Get playlist by ID
exports.getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Ensure user owns the playlist
    if (playlist.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get songs in playlist
    const playlistSongs = await Playlist.getPlaylistSongs(id);
    
    res.json({
      ...playlist,
      songs: playlistSongs
    });
  } catch (error) {
    console.error('Get playlist by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching playlist' });
  }
};

// Create playlist
exports.createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/images/${req.file.filename}`;
    }
    
    const playlist = {
      name,
      user_id: userId,
      image: imagePath,
      created_at: new Date()
    };
    
    const newPlaylist = await Playlist.create(playlist);
    
    // Log playlist creation
    await UserLog.create({
      user_id: userId,
      action: 'playlist_create',
      details: `${req.user.username} created playlist "${name}"`,
      timestamp: new Date()
    });
    
    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: newPlaylist
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Server error while creating playlist' });
  }
};

// Update playlist
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name } = req.body;
    
    const existingPlaylist = await Playlist.findById(id);
    
    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Ensure user owns the playlist
    if (existingPlaylist.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedPlaylist = {
      name: name || existingPlaylist.name,
      image: existingPlaylist.image
    };
    
    // Handle image upload if present
    if (req.file) {
      // Delete old image if it exists
      if (existingPlaylist.image) {
        const oldImagePath = path.join(__dirname, '..', existingPlaylist.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedPlaylist.image = `/uploads/images/${req.file.filename}`;
    }
    
    await Playlist.update(id, updatedPlaylist);
    
    // Log playlist update
    await UserLog.create({
      user_id: userId,
      action: 'playlist_update',
      details: `${req.user.username} updated playlist "${updatedPlaylist.name}"`,
      timestamp: new Date()
    });
    
    res.json({
      message: 'Playlist updated successfully',
      playlist: { id, ...updatedPlaylist }
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Server error while updating playlist' });
  }
};

// Delete playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const existingPlaylist = await Playlist.findById(id);
    
    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Ensure user owns the playlist
    if (existingPlaylist.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete playlist image if it exists
    if (existingPlaylist.image) {
      const imagePath = path.join(__dirname, '..', existingPlaylist.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete playlist and its songs
    await Playlist.delete(id);
    
    // Log playlist deletion
    await UserLog.create({
      user_id: userId,
      action: 'playlist_delete',
      details: `${req.user.username} deleted playlist "${existingPlaylist.name}"`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: 'Server error while deleting playlist' });
  }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, musicId } = req.params;
    const userId = req.user.id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Ensure user owns the playlist
    if (playlist.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if song already in playlist
    const isSongInPlaylist = await Playlist.isSongInPlaylist(playlistId, musicId);
    if (isSongInPlaylist) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }
    
    await Playlist.addSong(playlistId, musicId);
    
    // Log adding song to playlist
    await UserLog.create({
      user_id: userId,
      action: 'playlist_add_song',
      details: `${req.user.username} added a song to playlist "${playlist.name}"`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Song added to playlist successfully' });
  } catch (error) {
    console.error('Add song to playlist error:', error);
    res.status(500).json({ message: 'Server error while adding song to playlist' });
  }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, musicId } = req.params;
    const userId = req.user.id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Ensure user owns the playlist
    if (playlist.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Playlist.removeSong(playlistId, musicId);
    
    // Log removing song from playlist
    await UserLog.create({
      user_id: userId,
      action: 'playlist_remove_song',
      details: `${req.user.username} removed a song from playlist "${playlist.name}"`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Song removed from playlist successfully' });
  } catch (error) {
    console.error('Remove song from playlist error:', error);
    res.status(500).json({ message: 'Server error while removing song from playlist' });
  }
};

// Get all playlists for admin
exports.getAllPlaylists = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const playlists = await Playlist.findAll();
    res.json(playlists);
  } catch (error) {
    console.error('Get all playlists error:', error);
    res.status(500).json({ message: 'Server error while fetching playlists' });
  }
};
