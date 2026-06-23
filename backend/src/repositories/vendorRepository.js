import db from '../database/db.js';

export const vendorRepository = {
  findAll() {
    return db.prepare('SELECT * FROM vendors ORDER BY name ASC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);
  },

  create(vendor) {
    const { name, contact_person, email, phone, service_provided } = vendor;
    const stmt = db.prepare('INSERT INTO vendors (name, contact_person, email, phone, service_provided) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, contact_person, email, phone, service_provided);
    return { id: info.lastInsertRowid, ...vendor };
  },

  update(id, vendor) {
    const { name, contact_person, email, phone, service_provided } = vendor;
    const stmt = db.prepare('UPDATE vendors SET name = ?, contact_person = ?, email = ?, phone = ?, service_provided = ? WHERE id = ?');
    stmt.run(name, contact_person, email, phone, service_provided, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM vendors WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
