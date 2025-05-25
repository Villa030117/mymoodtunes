const db = require('../config/db');

class Favorite {
  // Get all favorites for a user
  static async findAllByUser(userId) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji, f.added_at
      FROM favorites f
      JOIN music m ON f.music_id = m.id
      JOIN categories c ON m.category_id = c.id
      WHERE f.user_id = ?
      ORDER BY f.added_at DESC
    `;
    return await db.query(query, [userId]);
  }

  // Get favorites by category for a user
  static async findByCategory(userId, categoryId) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji, f.added_at
      FROM favorites f
      JOIN music m ON f.music_id = m.id
      JOIN categories c ON m.category_id = c.id
      WHERE f.user_id = ? AND m.category_id = ?
      ORDER BY f.added_at DESC
    `;
    return await db.query(query, [userId, categoryId]);
  }

  // Add music to favorites
  static async add(userId, musicId) {
    const query = `
      INSERT INTO favorites (user_id, music_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE added_at = CURRENT_TIMESTAMP
    `;
    
    const result = await db.query(query, [userId, musicId]);
    return result.insertId || result.affectedRows > 0;
  }

  // Remove music from favorites
  static async remove(userId, musicId) {
    const query = `
      DELETE FROM favorites 
      WHERE user_id = ? AND music_id = ?
    `;
    
    const result = await db.query(query, [userId, musicId]);
    return result.affectedRows > 0;
  }

  // Check if music is in user's favorites
  static async isInFavorites(userId, musicId) {
    const query = `
      SELECT id FROM favorites
      WHERE user_id = ? AND music_id = ?
    `;
    
    const favorites = await db.query(query, [userId, musicId]);
    return favorites.length > 0;
  }

  // Get all favorites (for admin)
  static async findAll() {
    const query = `
      SELECT f.*, u.username, m.title as music_title, m.artist
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      JOIN music m ON f.music_id = m.id
      ORDER BY f.added_at DESC
    `;
    return await db.query(query);
  }
}

module.exports = Favorite;
