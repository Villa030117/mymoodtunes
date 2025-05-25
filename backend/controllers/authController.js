const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserLog = require('../models/UserLog');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      username,
      email,
      password: hashedPassword,
      profile_image: null,
      created_at: new Date()
    };

    const newUser = await User.create(user);
    
    // Log user registration
    await UserLog.create({
      user_id: newUser.id,
      action: 'registration',
      details: `${username} registered an account`,
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin login
    if (email === 'admin' && password === '1234') {
      const token = jwt.sign(
        { id: 0, username: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Admin logged in successfully',
        token,
        user: {
          id: 0,
          username: 'admin',
          role: 'admin'
        }
      });
    }

    // Regular user login
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log user login
    await UserLog.create({
      user_id: user.id,
      action: 'login',
      details: `${user.username} logged in to MoodTunes`,
      timestamp: new Date()
    });

    res.json({
      message: 'User logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({
        id: 0,
        username: 'admin',
        role: 'admin'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      role: 'user'
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const imagePath = `/uploads/images/${req.file.filename}`;
    
    await User.updateProfilePicture(req.user.id, imagePath);
    
    // Log profile update
    await UserLog.create({
      user_id: req.user.id,
      action: 'profile_update',
      details: `${req.user.username} updated their profile picture`,
      timestamp: new Date()
    });

    res.json({ 
      message: 'Profile picture updated successfully',
      profile_image: imagePath
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      // Log user logout
      await UserLog.create({
        user_id: req.user.id,
        action: 'logout',
        details: `${req.user.username} logged out from MoodTunes`,
        timestamp: new Date()
      });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};