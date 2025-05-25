const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Get user by ID
  static async findById(id) {
    const query = 'SELECT id, username, email, profile_pic, is_admin, created_at FROM users WHERE id = ?';
    const users = await db.query(query, [id]);
    return users.length ? users[0] : null;
  }

  // Get user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const users = await db.query(query, [email]);
    return users.length ? users[0] : null;
  }

  // Create new user
  static async create(userData) {
    const { username, email, password } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const result = await db.query(query, [username, email, hashedPassword]);
    
    return result.insertId;
  }

  // Update user profile
  static async updateProfile(id, updates) {
    const { username, profile_pic } = updates;
    
    let query = 'UPDATE users SET ';
    const params = [];
    
    if (username) {
      query += 'username = ?, ';
      params.push(username);
    }
    
    if (profile_pic) {
      query += 'profile_pic = ?, ';
      params.push(profile_pic);
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const result = await db.query(query, params);
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const result = await db.query(query, [hashedPassword, id]);
    
    return result.affectedRows > 0;
  }

  // Compare password with hash
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Get all users (for admin)
  static async findAll() {
    const query = 'SELECT id, username, email, profile_pic, is_admin, created_at FROM users';
    return await db.query(query);
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await db.query(query, [id]);
    
    return result.affectedRows > 0;
  }
}

module.exports = User;
