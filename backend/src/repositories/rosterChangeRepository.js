import db from '../database/db.js';

export const rosterChangeRepository = {
  findAll() {
    return db.prepare(`
      SELECT rcr.*, e.name AS employee_name, e.employee_code,
             u.name AS requested_by_name, rv.name AS reviewed_by_name
      FROM roster_change_requests rcr
      JOIN employees e ON rcr.employee_id = e.id
      LEFT JOIN users u ON rcr.requested_by = u.id
      LEFT JOIN users rv ON rcr.reviewed_by = rv.id
      ORDER BY rcr.created_at DESC
    `).all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM roster_change_requests WHERE id = ?').get(id);
  },

  create({ employee_id, roster_date, requested_status, requested_by }) {
    const existing = db.prepare(
      'SELECT id FROM roster_change_requests WHERE employee_id = ? AND roster_date = ? AND status = ?'
    ).get(employee_id, roster_date, 'Pending');

    if (existing) {
      db.prepare('UPDATE roster_change_requests SET requested_status = ? WHERE id = ?')
        .run(requested_status, existing.id);
      return this.findById(existing.id);
    }

    const info = db.prepare(
      'INSERT INTO roster_change_requests (employee_id, roster_date, requested_status, requested_by) VALUES (?, ?, ?, ?)'
    ).run(employee_id, roster_date, requested_status, requested_by);
    return this.findById(info.lastInsertRowid);
  },

  updateStatus(id, status, reviewedBy) {
    db.prepare('UPDATE roster_change_requests SET status = ?, reviewed_by = ? WHERE id = ?')
      .run(status, reviewedBy, id);
    return this.findById(id);
  }
};
