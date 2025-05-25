const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // Use .env for production
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Mood_Tunes'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to database');
});

// Routes

// Get all music
app.get('/api/music', (req, res) => {
  const query = 'SELECT music.id, music.title, music.artist, music.audio_file, music.cover_image, categories.name AS category FROM music JOIN categories ON music.category_id = categories.id';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching music:', err);
      return res.status(500).json({ error: 'Error fetching music' });
    }
    res.json(results);
  });
});

// Get music by category
app.get('/api/music/category/:category', (req, res) => {
  const { category } = req.params;
  const query = 'SELECT music.id, music.title, music.artist, music.audio_file, music.cover_image FROM music JOIN categories ON music.category_id = categories.id WHERE categories.name = ?';
  db.query(query, [category], (err, results) => {
    if (err) {
      console.error('Error fetching music by category:', err);
      return res.status(500).json({ error: 'Error fetching music' });
    }
    res.json(results);
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Error fetching categories' });
    }
    res.json(results);
  });
});

// Add a music to favorites
app.post('/api/favorites', (req, res) => {
  const { user_id, music_id } = req.body;
  const query = 'INSERT INTO favorites (user_id, music_id) VALUES (?, ?)';
  db.query(query, [user_id, music_id], (err, results) => {
    if (err) {
      console.error('Error adding to favorites:', err);
      return res.status(500).json({ error: 'Error adding to favorites' });
    }
    res.status(201).json({ message: 'Added to favorites' });
  });
});

// Get user's favorite music
app.get('/api/favorites/:user_id', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT music.id, music.title, music.artist, music.audio_file, music.cover_image FROM music JOIN favorites ON music.id = favorites.music_id WHERE favorites.user_id = ?';
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ error: 'Error fetching favorites' });
    }
    res.json(results);
  });
});

// Create a new playlist
app.post('/api/playlists', (req, res) => {
  const { name, user_id, image } = req.body;
  const query = 'INSERT INTO playlists (name, user_id, image) VALUES (?, ?, ?)';
  db.query(query, [name, user_id, image], (err, results) => {
    if (err) {
      console.error('Error creating playlist:', err);
      return res.status(500).json({ error: 'Error creating playlist' });
    }
    res.status(201).json({ message: 'Playlist created' });
  });
});

// Add music to playlist
app.post('/api/playlist/music', (req, res) => {
  const { playlist_id, music_id } = req.body;
  const query = 'INSERT INTO playlist_music (playlist_id, music_id) VALUES (?, ?)';
  db.query(query, [playlist_id, music_id], (err, results) => {
    if (err) {
      console.error('Error adding music to playlist:', err);
      return res.status(500).json({ error: 'Error adding music to playlist' });
    }
    res.status(201).json({ message: 'Music added to playlist' });
  });
});

// Get music by playlist
app.get('/api/playlists/:playlist_id/music', (req, res) => {
  const { playlist_id } = req.params;
  const query = 'SELECT music.id, music.title, music.artist, music.audio_file, music.cover_image FROM music JOIN playlist_music ON music.id = playlist_music.music_id WHERE playlist_music.playlist_id = ?';
  db.query(query, [playlist_id], (err, results) => {
    if (err) {
      console.error('Error fetching music from playlist:', err);
      return res.status(500).json({ error: 'Error fetching music from playlist' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


