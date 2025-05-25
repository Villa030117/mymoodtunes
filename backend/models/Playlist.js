const db = require('../config/db');

class Playlist {
  // Get all playlists for a user
  static async findAllByUser(userId) {
    const query = `
      SELECT * FROM playlists
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    return await db.query(query, [userId]);
  }

  // Get playlist by ID
  static async findById(id) {
    const query = `
      SELECT * FROM playlists
      WHERE id = ?
    `;
    const playlists = await db.query(query, [id]);
    return playlists.length ? playlists[0] : null;
  }

  // Create new playlist
  static async create(playlistData) {
    const { name, user_id, image } = playlistData;
    
    const query = `
      INSERT INTO playlists (name, user_id, image) 
      VALUES (?, ?, ?)
    `;
    
    const result = await db.query(query, [name, user_id, image]);
    return result.insertId;
  }

  // Update playlist
  static async update(id, userId, updates) {
    const { name, image } = updates;
    
    let query = 'UPDATE playlists SET ';
    const params = [];
    
    if (name) {
      query += 'name = ?, ';
      params.push(name);
    }
    
    if (image) {
      query += 'image = ?, ';
      params.push(image);
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    
    query += ' WHERE id = ? AND user_id = ?';
    params.push(id, userId);
    
    const result = await db.query(query, params);
    return result.affectedRows > 0;
  }

  // Delete playlist
  static async delete(id, userId) {
    const query = 'DELETE FROM playlists WHERE id = ? AND user_id = ?';
    const result = await db.query(query, [id, userId]);
    
    return result.affectedRows > 0;
  }

  // Get music in playlist
  static async getPlaylistMusic(playlistId) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji, pm.added_at
      FROM playlist_music pm
      JOIN music m ON pm.music_id = m.id
      JOIN categories c ON m.category_id = c.id
      WHERE pm.playlist_id = ?
      ORDER BY pm.added_at DESC
    `;
    return await db.query(query, [playlistId]);
  }

  // Add music to playlist
  static async addMusic(playlistId, musicId) {
    const query = `
      INSERT INTO playlist_music (playlist_id, music_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE added_at = CURRENT_TIMESTAMP
    `;
    
    const result = await db.query(query, [playlistId, musicId]);
    return result.insertId || result.affectedRows > 0;
  }

  // Remove music from playlist
  static async removeMusic(playlistId, musicId) {
    const query = `
      DELETE FROM playlist_music 
      WHERE playlist_id = ? AND music_id = ?
    `;
    
    const result = await db.query(query, [playlistId, musicId]);
    return result.affectedRows > 0;
  }

  // Check if a playlist belongs to a user
  static async belongsToUser(playlistId, userId) {
    const query = `
      SELECT id FROM playlists
      WHERE id = ? AND user_id = ?
    `;
    
    const playlists = await db.query(query, [playlistId, userId]);
    return playlists.length > 0;
  }

  // Get all playlists (for admin)
  static async findAll() {
    const query = `
      SELECT p.*, u.username 
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
    return await db.query(query);
  }
}

module.exports = Playlist;
