import db from '../database/db.js';

export const userRepository = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
  },

  create(user) {
    const { name, email, password, role } = user;
    const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, password, role);
    return { id: info.lastInsertRowid, ...user };
  },

  findAll() {
    return db.prepare('SELECT id, name, email, role FROM users').all();
  }
};
