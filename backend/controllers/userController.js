const User = require('../models/User');
const UserLog = require('../models/UserLog');
const Playlist = require('../models/Playlist');
const Favorite = require('../models/Favorite');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    await User.update(userId, { username });
    
    // Log profile update
    await UserLog.create({
      user_id: userId,
      action: 'profile_update',
      details: `User updated their profile`,
      timestamp: new Date()
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's playlists count
    const playlists = await Playlist.findByUserId(userId);
    
    // Get user's favorites count
    const favorites = await Favorite.findByUserId(userId);
    
    // Get user's activity logs
    const logs = await UserLog.findByUserId(userId, 10); // Get 10 most recent logs
    
    res.json({
      playlistsCount: playlists.length,
      favoritesCount: favorites.length,
      recentActivity: logs
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error while fetching user stats' });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    // Get total users count
    const usersCount = await User.count();
    
    // Get total songs count
    const songsCount = await User.countsongs();
    
    // Get total playlists count
    const playlistsCount = await Playlist.count();
    
    // Get total favorites count
    const favoritesCount = await Favorite.count();
    
    // Get mood counts
    const moodCounts = await User.countByMoods();
    
    // Get recent user logs
    const recentLogs = await UserLog.findRecent(10);
    
    res.json({
      usersCount,
      songsCount,
      playlistsCount,
      favoritesCount,
      moodCounts,
      recentActivity: recentLogs
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error while fetching admin stats' });
  }
};

// Get user logs (admin only)
exports.getUserLogs = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const logs = await UserLog.findPaginated(page, limit);
    const total = await UserLog.count();
    
    res.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({ message: 'Server error while fetching user logs' });
  }
};
