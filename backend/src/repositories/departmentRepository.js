import db from '../database/db.js';

export const departmentRepository = {
  findAll() {
    return db.prepare('SELECT * FROM departments ORDER BY name ASC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM departments WHERE id = ?').get(id);
  },

  create(dept) {
    const { name, description, fixed_week_off } = dept;
    const stmt = db.prepare('INSERT INTO departments (name, description, fixed_week_off) VALUES (?, ?, ?)');
    const info = stmt.run(name, description, fixed_week_off || 'Sunday');
    return { id: info.lastInsertRowid, ...dept };
  },

  update(id, dept) {
    const { name, description, fixed_week_off } = dept;
    const stmt = db.prepare('UPDATE departments SET name = ?, description = ?, fixed_week_off = ? WHERE id = ?');
    stmt.run(name, description, fixed_week_off, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM departments WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
