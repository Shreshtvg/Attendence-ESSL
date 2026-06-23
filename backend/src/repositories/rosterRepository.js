import db from '../database/db.js';

export const rosterRepository = {
  findAll(startDate, endDate) {
    let query = `
      SELECT r.*, e.name AS employee_name, e.employee_code, s.name AS shift_name
      FROM rosters r
      JOIN employees e ON r.employee_id = e.id
      LEFT JOIN shifts s ON r.shift_id = s.id
    `;
    const params = [];
    if (startDate && endDate) {
      query += ` WHERE r.roster_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    query += ` ORDER BY r.roster_date ASC`;
    return db.prepare(query).all(...params);
  },

  assign(roster) {
    const { employee_id, roster_date, shift_id } = roster;
    // UPSERT
    const stmt = db.prepare(`
      INSERT INTO rosters (employee_id, roster_date, shift_id)
      VALUES (?, ?, ?)
      ON CONFLICT(employee_id, roster_date) DO UPDATE SET shift_id = excluded.shift_id
    `);
    const info = stmt.run(employee_id, roster_date, shift_id);
    return roster;
  },

  delete(employeeId, date) {
    const stmt = db.prepare('DELETE FROM rosters WHERE employee_id = ? AND roster_date = ?');
    const info = stmt.run(employeeId, date);
    return info.changes > 0;
  }
};
