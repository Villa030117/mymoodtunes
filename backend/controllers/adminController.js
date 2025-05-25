const User = require('../models/User');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const Favorite = require('../models/Favorite');
const UserLog = require('../models/UserLog');
const db = require('../config/db');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total songs count
    const [musicCount] = await db.query('SELECT COUNT(*) as count FROM music');
    
    // Get distinct mood categories count
    const [moodCount] = await db.query('SELECT COUNT(DISTINCT category) as count FROM music');
    
    // Get total playlists count
    const [playlistCount] = await db.query('SELECT COUNT(*) as count FROM playlists');
    
    // Get total favorites count
    const [favoriteCount] = await db.query('SELECT COUNT(*) as count FROM favorites');
    
    // Get total users count
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    
    // Get recent activities/logs (limit to 10 most recent)
    const [recentActivities] = await db.query(`
      SELECT ul.id, ul.user_id, u.username, ul.action, ul.details, ul.created_at 
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      ORDER BY ul.created_at DESC
      LIMIT 10
    `);
    
    res.status(200).json({
      stats: {
        totalSongs: musicCount[0].count,
        moodCategories: moodCount[0].count,
        totalPlaylists: playlistCount[0].count,
        totalFavorites: favoriteCount[0].count,
        totalUsers: userCount[0].count
      },
      recentActivities
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard statistics' });
  }
};

// Get all user logs with pagination
exports.getUserLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const [totalCount] = await db.query('SELECT COUNT(*) as count FROM user_logs');
    
    // Get logs with user information
    const [logs] = await db.query(`
      SELECT ul.id, ul.user_id, u.username, ul.action, ul.details, ul.created_at 
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      ORDER BY ul.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    res.status(200).json({
      logs,
      pagination: {
        total: totalCount[0].count,
        page,
        limit,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user logs:', error);
    res.status(500).json({ message: 'Failed to retrieve user logs' });
  }
};

// Get all favorites for admin management
exports.getAllFavorites = async (req, res) => {
  try {
    const [favorites] = await db.query(`
      SELECT f.id, f.user_id, u.username, f.music_id, m.title, m.artist, m.category, m.cover_image, f.created_at
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      JOIN music m ON f.music_id = m.id
      ORDER BY f.created_at DESC
    `);
    
    // Group favorites by user
    const favoritesByUser = favorites.reduce((acc, favorite) => {
      const userId = favorite.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          username: favorite.username,
          favorites: []
        };
      }
      
      acc[userId].favorites.push({
        id: favorite.id,
        music_id: favorite.music_id,
        title: favorite.title,
        artist: favorite.artist,
        category: favorite.category,
        cover_image: favorite.cover_image,
        created_at: favorite.created_at
      });
      
      return acc;
    }, {});
    
    res.status(200).json(Object.values(favoritesByUser));
  } catch (error) {
    console.error('Error getting all favorites:', error);
    res.status(500).json({ message: 'Failed to retrieve favorites' });
  }
};

// Delete a user's favorite (admin operation)
exports.deleteFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    
    // Check if favorite exists
    const [favorite] = await db.query('SELECT * FROM favorites WHERE id = ?', [favoriteId]);
    if (favorite.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    // Delete the favorite
    await db.query('DELETE FROM favorites WHERE id = ?', [favoriteId]);
    
    // Log the action
    await db.query(
      'INSERT INTO user_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_DELETE_FAVORITE', `Admin deleted a favorite (ID: ${favoriteId})`]
    );
    
    res.status(200).json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ message: 'Failed to delete favorite' });
  }
};

// Get all playlists for admin management
exports.getAllPlaylists = async (req, res) => {
  try {
    // Get all playlists with user info
    const [playlists] = await db.query(`
      SELECT p.id, p.name, p.image, p.user_id, u.username, p.created_at
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    // Get songs for each playlist
    for (let playlist of playlists) {
      const [songs] = await db.query(`
        SELECT pm.id, m.id as music_id, m.title, m.artist, m.category, m.cover_image
        FROM playlist_music pm
        JOIN music m ON pm.music_id = m.id
        WHERE pm.playlist_id = ?
      `, [playlist.id]);
      
      playlist.songs = songs;
    }
    
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error getting all playlists:', error);
    res.status(500).json({ message: 'Failed to retrieve playlists' });
  }
};

// Delete a playlist (admin operation)
exports.deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    // Check if playlist exists
    const [playlist] = await db.query('SELECT * FROM playlists WHERE id = ?', [playlistId]);
    if (playlist.length === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Delete all playlist-music associations first
    await db.query('DELETE FROM playlist_music WHERE playlist_id = ?', [playlistId]);
    
    // Delete the playlist
    await db.query('DELETE FROM playlists WHERE id = ?', [playlistId]);
    
    // Log the action
    await db.query(
      'INSERT INTO user_logs (user_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'ADMIN_DELETE_PLAYLIST', `Admin deleted a playlist (ID: ${playlistId})`]
    );
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Failed to delete playlist' });
  }
};

module.exports = exports;
