import db from '../database/db.js';

export const shiftRepository = {
  findAll() {
    return db.prepare('SELECT * FROM shifts ORDER BY name ASC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM shifts WHERE id = ?').get(id);
  },

  create(shift) {
    const { name, start_time, end_time } = shift;
    const stmt = db.prepare('INSERT INTO shifts (name, start_time, end_time) VALUES (?, ?, ?)');
    const info = stmt.run(name, start_time, end_time);
    return { id: info.lastInsertRowid, ...shift };
  },

  update(id, shift) {
    const { name, start_time, end_time } = shift;
    const stmt = db.prepare('UPDATE shifts SET name = ?, start_time = ?, end_time = ? WHERE id = ?');
    stmt.run(name, start_time, end_time, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM shifts WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
