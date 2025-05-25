 
const db = require('../config/db');

class UserLog {
  // Create log entry
  static async create(logData) {
    const { user_id, action, action_details } = logData;
    
    const query = `
      INSERT INTO user_logs (user_id, action, action_details) 
      VALUES (?, ?, ?)
    `;
    
    const result = await db.query(query, [user_id, action, action_details || null]);
    return result.insertId;
  }

  // Get all logs (for admin)
  static async findAll(limit = 100) {
    const query = `
      SELECT ul.*, u.username
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      ORDER BY ul.created_at DESC
      LIMIT ?
    `;
    return await db.query(query, [limit]);
  }

  // Get logs by user
  static async findByUser(userId, limit = 50) {
    const query = `
      SELECT *
      FROM user_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    return await db.query(query, [userId, limit]);
  }

  // Get recent activities
  static async getRecentActivities(limit = 10) {
    const query = `
      SELECT ul.*, u.username
      FROM user_logs ul
      JOIN users u ON ul.user_id = u.id
      ORDER BY ul.created_at DESC
      LIMIT ?
    `;
    return await db.query(query, [limit]);
  }
}

module.exports = UserLog;