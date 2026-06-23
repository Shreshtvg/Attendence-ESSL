import db from '../database/db.js';

export const holidayRepository = {
  findAll() {
    return db.prepare('SELECT * FROM holidays ORDER BY holiday_date ASC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM holidays WHERE id = ?').get(id);
  },

  create(holiday) {
    const { holiday_date, name, description } = holiday;
    const stmt = db.prepare('INSERT INTO holidays (holiday_date, name, description) VALUES (?, ?, ?)');
    const info = stmt.run(holiday_date, name, description);
    return { id: info.lastInsertRowid, ...holiday };
  },

  update(id, holiday) {
    const { holiday_date, name, description } = holiday;
    const stmt = db.prepare('UPDATE holidays SET holiday_date = ?, name = ?, description = ? WHERE id = ?');
    stmt.run(holiday_date, name, description, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM holidays WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
