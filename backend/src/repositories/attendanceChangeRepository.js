import db from '../database/db.js';

export const attendanceChangeRepository = {
  findAll() {
    return db.prepare(`
      SELECT ac.*, e.name AS employee_name, e.employee_code, u.name AS approver_name
      FROM attendance_changes ac
      JOIN employees e ON ac.employee_id = e.id
      LEFT JOIN users u ON ac.approved_by = u.id
      ORDER BY ac.attendance_date DESC
    `).all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM attendance_changes WHERE id = ?').get(id);
  },

  create(req) {
    const { employee_id, attendance_id, attendance_date, requested_check_in, requested_check_out, requested_status, reason } = req;
    const stmt = db.prepare(`
      INSERT INTO attendance_changes (employee_id, attendance_id, attendance_date, requested_check_in, requested_check_out, requested_status, reason, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `);
    const info = stmt.run(
      employee_id, attendance_id ?? null, attendance_date,
      requested_check_in ?? null, requested_check_out ?? null,
      requested_status || 'Present', reason || null
    );
    return { id: info.lastInsertRowid, ...req };
  },

  updateStatus(id, status, approvedBy) {
    const stmt = db.prepare('UPDATE attendance_changes SET status = ?, approved_by = ? WHERE id = ?');
    stmt.run(status, approvedBy, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM attendance_changes WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
