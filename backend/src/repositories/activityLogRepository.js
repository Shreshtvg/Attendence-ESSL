import db from '../database/db.js';

export const activityLogRepository = {
  findAll() {
    return db.prepare(`
      SELECT al.*, u.name as user_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.timestamp DESC
      LIMIT 100
    `).all();
  },

  log(text, type = 'Info', userId = null) {
    const stmt = db.prepare('INSERT INTO activity_logs (text, type, user_id) VALUES (?, ?, ?)');
    stmt.run(text, type, userId);
  }
};
