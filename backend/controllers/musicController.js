const Music = require('../models/Music');
const Favorite = require('../models/Favorite');
const UserLog = require('../models/UserLog');
const fs = require('fs');
const path = require('path');

// Get all music
exports.getAllMusic = async (req, res) => {
  try {
    const music = await Music.findAll();
    res.json(music);
  } catch (error) {
    console.error('Get all music error:', error);
    res.status(500).json({ message: 'Server error while fetching music' });
  }
};

// Get music by ID
exports.getMusicById = async (req, res) => {
  try {
    const { id } = req.params;
    const music = await Music.findById(id);
    
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    
    res.json(music);
  } catch (error) {
    console.error('Get music by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching music' });
  }
};

// Get music by mood/category
exports.getMusicByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const music = await Music.findByMood(mood);
    res.json(music);
  } catch (error) {
    console.error('Get music by mood error:', error);
    res.status(500).json({ message: 'Server error while fetching music by mood' });
  }
};

// Search music
exports.searchMusic = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await Music.search(query);
    res.json(results);
  } catch (error) {
    console.error('Search music error:', error);
    res.status(500).json({ message: 'Server error while searching music' });
  }
};

// Add new music (admin only)
exports.addMusic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { title, artist, mood } = req.body;
    
    if (!title || !artist || !mood) {
      return res.status(400).json({ message: 'Title, artist and mood are required' });
    }
    
    if (!req.files.audio || !req.files.cover) {
      return res.status(400).json({ message: 'Audio file and cover image are required' });
    }
    
    const audioPath = `/uploads/music/${req.files.audio[0].filename}`;
    const coverPath = `/uploads/images/${req.files.cover[0].filename}`;
    
    const music = {
      title,
      artist,
      mood,
      audio_file: audioPath,
      cover_image: coverPath,
      created_at: new Date()
    };
    
    const newMusic = await Music.create(music);
    
    res.status(201).json({
      message: 'Music added successfully',
      music: newMusic
    });
  } catch (error) {
    console.error('Add music error:', error);
    res.status(500).json({ message: 'Server error while adding music' });
  }
};

// Update music (admin only)
exports.updateMusic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    const { title, artist, mood } = req.body;
    
    const existingMusic = await Music.findById(id);
    if (!existingMusic) {
      return res.status(404).json({ message: 'Music not found' });
    }
    
    const updatedMusic = {
      title: title || existingMusic.title,
      artist: artist || existingMusic.artist,
      mood: mood || existingMusic.mood,
      audio_file: existingMusic.audio_file,
      cover_image: existingMusic.cover_image
    };
    
    // Handle file uploads if present
    if (req.files) {
      if (req.files.audio) {
        // Delete old audio file
        const oldAudioPath = path.join(__dirname, '..', existingMusic.audio_file);
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath);
        }
        updatedMusic.audio_file = `/uploads/music/${req.files.audio[0].filename}`;
      }
      
      if (req.files.cover) {
        // Delete old cover image
        const oldCoverPath = path.join(__dirname, '..', existingMusic.cover_image);
        if (fs.existsSync(oldCoverPath)) {
          fs.unlinkSync(oldCoverPath);
        }
        updatedMusic.cover_image = `/uploads/images/${req.files.cover[0].filename}`;
      }
    }
    
    await Music.update(id, updatedMusic);
    
    res.json({
      message: 'Music updated successfully',
      music: { id, ...updatedMusic }
    });
  } catch (error) {
    console.error('Update music error:', error);
    res.status(500).json({ message: 'Server error while updating music' });
  }
};

// Delete music (admin only)
exports.deleteMusic = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    
    const existingMusic = await Music.findById(id);
    if (!existingMusic) {
      return res.status(404).json({ message: 'Music not found' });
    }
    
    // Delete associated files
    const audioPath = path.join(__dirname, '..', existingMusic.audio_file);
    const coverPath = path.join(__dirname, '..', existingMusic.cover_image);
    
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
    
    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
    }
    
    // Delete music record
    await Music.delete(id);
    
    // Delete associated favorites
    await Favorite.deleteByMusicId(id);
    
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Delete music error:', error);
    res.status(500).json({ message: 'Server error while deleting music' });
  }
};

// Get recently added music
exports.getRecentMusic = async (req, res) => {
  try {
    const music = await Music.findRecent(10); // Get 10 most recent tracks
    res.json(music);
  } catch (error) {
    console.error('Get recent music error:', error);
    res.status(500).json({ message: 'Server error while fetching recent music' });
  }
};

// Log music play
exports.logMusicPlay = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { musicId } = req.params;
    
    const music = await Music.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    
    // Log the music play
    await UserLog.create({
      user_id: req.user.id,
      action: 'music_play',
      details: `${req.user.username} played "${music.title}" by ${music.artist}`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Music play logged successfully' });
  } catch (error) {
    console.error('Log music play error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};