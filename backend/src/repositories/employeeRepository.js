import db from '../database/db.js';

export const employeeRepository = {
  findAll(filters = {}) {
    const { search, department_id, designation_id, shift_id, branch, status } = filters;
    let query = `
      SELECT e.*, 
             dept.name AS department_name, 
             desg.name AS designation_name, 
             s.name AS shift_name,
             s.start_time AS shift_start,
             s.end_time AS shift_end
      FROM employees e
      LEFT JOIN departments dept ON e.department_id = dept.id
      LEFT JOIN designations desg ON e.designation_id = desg.id
      LEFT JOIN shifts s ON e.shift_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (e.name LIKE ? OR e.employee_code LIKE ? OR e.email LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }
    if (department_id) {
      query += ` AND e.department_id = ?`;
      params.push(department_id);
    }
    if (designation_id) {
      query += ` AND e.designation_id = ?`;
      params.push(designation_id);
    }
    if (shift_id) {
      query += ` AND e.shift_id = ?`;
      params.push(shift_id);
    }
    if (branch) {
      query += ` AND e.branch = ?`;
      params.push(branch);
    }
    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY e.employee_code ASC`;

    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT e.*, 
             dept.name AS department_name, 
             desg.name AS designation_name, 
             s.name AS shift_name,
             s.start_time AS shift_start,
             s.end_time AS shift_end
      FROM employees e
      LEFT JOIN departments dept ON e.department_id = dept.id
      LEFT JOIN designations desg ON e.designation_id = desg.id
      LEFT JOIN shifts s ON e.shift_id = s.id
      WHERE e.id = ?
    `).get(id);
  },

  create(emp) {
    const { employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status } = emp;
    const stmt = db.prepare(`
      INSERT INTO employees (employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status || 'Active');
    return { id: info.lastInsertRowid, ...emp };
  },

  update(id, emp) {
    const { employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status } = emp;
    const stmt = db.prepare(`
      UPDATE employees 
      SET employee_code = ?, name = ?, email = ?, phone = ?, department_id = ?, designation_id = ?, shift_id = ?, branch = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status, id);
    return this.findById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};
