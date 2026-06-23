import db from '../database/db.js';

export const attendanceRepository = {
  // Find all attendance records for a single date
  findByDate(date, departmentId = null) {
    let query = `
      SELECT e.id AS employee_id,
             e.employee_code,
             e.name AS employee_name,
             e.branch,
             e.shift_id,
             dept.id AS department_id,
             dept.name AS department_name,
             dept.fixed_week_off,
             desg.name AS designation_name,
             a.id AS attendance_id,
             a.attendance_date,
             a.check_in,
             a.check_out,
             a.hours,
             a.status
      FROM employees e
      LEFT JOIN departments dept ON e.department_id = dept.id
      LEFT JOIN designations desg ON e.designation_id = desg.id
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.attendance_date = ?
      WHERE e.status = 'Active'
    `;
    const params = [date];

    if (departmentId) {
      query += ` AND e.department_id = ?`;
      params.push(departmentId);
    }

    query += ` ORDER BY dept.name ASC, e.employee_code ASC`;
    return db.prepare(query).all(...params);
  },

  // Save or update an attendance record
  save(record) {
    const { employee_id, attendance_date, check_in, check_out, hours, status } = record;
    
    // Check if record exists
    const existing = db.prepare('SELECT id FROM attendance WHERE employee_id = ? AND attendance_date = ?')
      .get(employee_id, attendance_date);

    if (existing) {
      const stmt = db.prepare(`
        UPDATE attendance 
        SET check_in = ?, check_out = ?, hours = ?, status = ?
        WHERE id = ?
      `);
      stmt.run(check_in, check_out, hours, status, existing.id);
      return { id: existing.id, ...record };
    } else {
      const stmt = db.prepare(`
        INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, hours, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(employee_id, attendance_date, check_in, check_out, hours, status);
      return { id: info.lastInsertRowid, ...record };
    }
  },

  findById(id) {
    return db.prepare(`
      SELECT a.*, e.name AS employee_name, e.employee_code
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.id = ?
    `).get(id);
  },

  findByEmployeeAndDate(employeeId, date) {
    return db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND attendance_date = ?')
      .get(employeeId, date);
  },

  getSummaryByDate(date) {
    // Generate simple aggregation for cards
    // Present, Absent, Leave, etc.
    // Ensure we count ALL active employees
    const employees = db.prepare("SELECT e.id, e.department_id, d.fixed_week_off FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.status = 'Active'").all();
    const records = db.prepare("SELECT employee_id, status FROM attendance WHERE attendance_date = ?").all(date);
    
    const recordMap = new Map(records.map(r => [r.employee_id, r.status]));
    
    let present = 0;
    let absent = 0;
    let leave = 0;
    let weekOff = 0;
    let holiday = 0;

    const dayName = new Date(date).toLocaleString('en-US', { weekday: 'long' });

    employees.forEach(emp => {
      const status = recordMap.get(emp.id);
      if (status) {
        if (status === 'Present') present++;
        else if (status === 'Leave') leave++;
        else if (status === 'Absent') absent++;
        else if (status === 'Week Off') weekOff++;
        else if (status === 'Holiday') holiday++;
      } else {
        // Fallback calculation for unlogged
        if (emp.fixed_week_off === dayName) {
          weekOff++;
        } else {
          absent++; // default is absent if no log
        }
      }
    });

    return {
      total: employees.length,
      present,
      absent,
      leave,
      weekOff,
      holiday
    };
  }
};
