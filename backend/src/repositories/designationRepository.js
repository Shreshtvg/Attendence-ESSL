import db from '../database/db.js';

export const designationRepository = {
  findAll() {
    return db.prepare(`
      SELECT d.*, dept.name AS department_name 
      FROM designations d
      LEFT JOIN departments dept ON d.department_id = dept.id
      ORDER BY d.name ASC
    `).all();
  },

  findById(id) {
    return db.prepare(`
      SELECT d.*, dept.name AS department_name 
      FROM designations d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = ?
    `).get(id);
  },

  create(desg) {
    const { name, department_id } = desg;
    const stmt = db.prepare('INSERT INTO designations (name, department_id) VALUES (?, ?)');
    const info = stmt.run(name, department_id);
    return { id: info.lastInsertRowid, ...desg };
  },

  update(id, desg) {
    const { name, department_id } = desg;
    const stmt = db.prepare('UPDATE designations SET name = ?, department_id = ? WHERE id = ?');
    stmt.run(name, department_id, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM designations WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
