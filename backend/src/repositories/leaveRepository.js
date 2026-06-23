import db from '../database/db.js';

export const leaveRepository = {
  findAll() {
    return db.prepare(`
      SELECT lr.*, e.name AS employee_name, e.employee_code, u.name AS approver_name
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN users u ON lr.approved_by = u.id
      ORDER BY lr.start_date DESC
    `).all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(id);
  },

  create(req) {
    const { employee_id, start_date, end_date, leave_type, reason, status } = req;
    const stmt = db.prepare(`
      INSERT INTO leave_requests (employee_id, start_date, end_date, leave_type, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(employee_id, start_date, end_date, leave_type, reason, status || 'Pending');
    return { id: info.lastInsertRowid, ...req };
  },

  updateStatus(id, status, approvedBy) {
    const stmt = db.prepare('UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?');
    stmt.run(status, approvedBy, id);
    return this.findById(id);
  },

  updateDetails(id, details) {
    const { leave_type, start_date, end_date, reason } = details;
    db.prepare('UPDATE leave_requests SET leave_type = ?, start_date = ?, end_date = ?, reason = ? WHERE id = ?')
      .run(leave_type, start_date, end_date, reason, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM leave_requests WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
