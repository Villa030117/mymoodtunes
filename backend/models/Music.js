const db = require('../config/db');

class Music {
  // Get all music
  static async findAll() {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji 
      FROM music m
      JOIN categories c ON m.category_id = c.id
      ORDER BY m.created_at DESC
    `;
    return await db.query(query);
  }

  // Get music by ID
  static async findById(id) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji 
      FROM music m
      JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `;
    const music = await db.query(query, [id]);
    return music.length ? music[0] : null;
  }

  // Get music by category
  static async findByCategory(categoryId) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji 
      FROM music m
      JOIN categories c ON m.category_id = c.id
      WHERE m.category_id = ?
      ORDER BY m.created_at DESC
    `;
    return await db.query(query, [categoryId]);
  }

  // Get music by emoji
  static async findByEmoji(emoji) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji 
      FROM music m
      JOIN categories c ON m.category_id = c.id
      WHERE c.emoji = ?
      ORDER BY m.created_at DESC
    `;
    return await db.query(query, [emoji]);
  }

  // Search music
  static async search(searchTerm) {
    const query = `
      SELECT m.*, c.name as category_name, c.emoji 
      FROM music m
      JOIN categories c ON m.category_id = c.id
      WHERE m.title LIKE ? OR m.artist LIKE ? OR c.emoji LIKE ?
      ORDER BY m.created_at DESC
    `;
    const searchParam = `%${searchTerm}%`;
    return await db.query(query, [searchParam, searchParam, searchParam]);
  }

  // Create new music
  static async create(musicData) {
    const { title, artist, category_id, audio_file, cover_image } = musicData;
    
    const query = `
      INSERT INTO music (title, artist, category_id, audio_file, cover_image) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await db.query(query, [
      title, artist, category_id, audio_file, cover_image
    ]);
    
    return result.insertId;
  }

  // Update music
  static async update(id, updates) {
    const { title, artist, category_id, audio_file, cover_image } = updates;
    
    let query = 'UPDATE music SET ';
    const params = [];
    
    if (title) {
      query += 'title = ?, ';
      params.push(title);
    }
    
    if (artist) {
      query += 'artist = ?, ';
      params.push(artist);
    }
    
    if (category_id) {
      query += 'category_id = ?, ';
      params.push(category_id);
    }
    
    if (audio_file) {
      query += 'audio_file = ?, ';
      params.push(audio_file);
    }
    
    if (cover_image) {
      query += 'cover_image = ?, ';
      params.push(cover_image);
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const result = await db.query(query, params);
    return result.affectedRows > 0;
  }

  // Delete music
  static async delete(id) {
    const query = 'DELETE FROM music WHERE id = ?';
    const result = await db.query(query, [id]);
    
    return result.affectedRows > 0;
  }

  // Get categories
  static async getCategories() {
    const query = 'SELECT * FROM categories';
    return await db.query(query);
  }

  // Get category by name
  static async getCategoryByName(name) {
    const query = 'SELECT * FROM categories WHERE name = ?';
    const categories = await db.query(query, [name]);
    return categories.length ? categories[0] : null;
  }

  // Get category by emoji
  static async getCategoryByEmoji(emoji) {
    const query = 'SELECT * FROM categories WHERE emoji = ?';
    const categories = await db.query(query, [emoji]);
    return categories.length ? categories[0] : null;
  }
}

module.exports = Music;
