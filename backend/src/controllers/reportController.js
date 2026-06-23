import db from '../database/db.js';

export const reportController = {
  getAttendanceReport(req, res) {
    try {
      const { startDate, endDate, departmentId } = req.query;
      let query = `
        SELECT a.*, e.name AS employee_name, e.employee_code, e.branch, dept.name as department_name, desg.name as designation_name
        FROM attendance a
        JOIN employees e ON a.employee_id = e.id
        LEFT JOIN departments dept ON e.department_id = dept.id
        LEFT JOIN designations desg ON e.designation_id = desg.id
        WHERE 1=1
      `;
      const params = [];
      if (startDate) {
        query += ` AND a.attendance_date >= ?`;
        params.push(startDate);
      }
      if (endDate) {
        query += ` AND a.attendance_date <= ?`;
        params.push(endDate);
      }
      if (departmentId) {
        query += ` AND e.department_id = ?`;
        params.push(Number(departmentId));
      }

      query += ` ORDER BY a.attendance_date DESC, e.employee_code ASC`;

      const data = db.prepare(query).all(...params);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getLeaveReport(req, res) {
    try {
      const { startDate, endDate, status } = req.query;
      let query = `
        SELECT lr.*, e.name AS employee_name, e.employee_code, dept.name as department_name
        FROM leave_requests lr
        JOIN employees e ON lr.employee_id = e.id
        LEFT JOIN departments dept ON e.department_id = dept.id
        WHERE 1=1
      `;
      const params = [];
      if (startDate) {
        query += ` AND lr.start_date >= ?`;
        params.push(startDate);
      }
      if (endDate) {
        query += ` AND lr.end_date <= ?`;
        params.push(endDate);
      }
      if (status) {
        query += ` AND lr.status = ?`;
        params.push(status);
      }

      query += ` ORDER BY lr.start_date DESC`;

      const data = db.prepare(query).all(...params);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getDepartmentReport(req, res) {
    try {
      // Aggregates: Department -> total employees, total present, total absent, total leaves
      const sql = `
        SELECT d.id, d.name, d.description,
          (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.id) AS total_employees,
          (SELECT COUNT(DISTINCT a.employee_id) 
           FROM attendance a 
           JOIN employees e ON a.employee_id = e.id 
           WHERE e.department_id = d.id AND a.status = 'Present') AS total_presents,
          (SELECT COUNT(DISTINCT a.employee_id) 
           FROM attendance a 
           JOIN employees e ON a.employee_id = e.id 
           WHERE e.department_id = d.id AND a.status = 'Leave') AS total_leaves
        FROM departments d
        ORDER BY d.name ASC
      `;
      const data = db.prepare(sql).all();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getVendorReport(req, res) {
    try {
      const data = db.prepare('SELECT * FROM vendors ORDER BY name ASC').all();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getMonthlyAttendanceReport(req, res) {
    try {
      const { year, month, branch, departmentId, shiftId } = req.query;
      if (!year || !month) {
        return res.status(400).json({ success: false, message: 'year and month are required' });
      }
      const y = Number(year);
      const m = Number(month);
      const lastDay = new Date(y, m, 0).getDate();
      const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      const endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      let empQuery = `
        SELECT e.id, e.employee_code AS employeeCode, e.name, e.branch,
          dept.name AS departmentName, dept.fixed_week_off AS fixedWeekOff,
          desg.name AS designationName
        FROM employees e
        LEFT JOIN departments dept ON e.department_id = dept.id
        LEFT JOIN designations desg ON e.designation_id = desg.id
        WHERE e.status = 'Active'
      `;
      const empParams = [];
      if (branch && branch !== 'All') {
        empQuery += ` AND e.branch = ?`;
        empParams.push(branch);
      }
      if (departmentId && departmentId !== 'All') {
        empQuery += ` AND e.department_id = ?`;
        empParams.push(Number(departmentId));
      }
      if (shiftId && shiftId !== 'All') {
        empQuery += ` AND e.shift_id = ?`;
        empParams.push(Number(shiftId));
      }
      empQuery += ` ORDER BY dept.name ASC, e.employee_code ASC`;

      const employees = db.prepare(empQuery).all(...empParams);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      if (employees.length === 0) {
        return res.status(200).json({
          success: true,
          data: { month: monthNames[m - 1], year: y, principalEmployer: 'Brookfield', site: '-', departments: [] }
        });
      }

      const employeeIds = employees.map(e => e.id);
      const placeholders = employeeIds.map(() => '?').join(',');
      const attendanceRows = db.prepare(`
        SELECT employee_id, attendance_date, status, hours
        FROM attendance
        WHERE attendance_date BETWEEN ? AND ? AND employee_id IN (${placeholders})
      `).all(startDate, endDate, ...employeeIds);

      const attendanceMap = new Map();
      attendanceRows.forEach(row => attendanceMap.set(`${row.employee_id}|${row.attendance_date}`, row));

      const holidayRows = db.prepare(`SELECT holiday_date FROM holidays WHERE holiday_date BETWEEN ? AND ?`).all(startDate, endDate);
      const holidaySet = new Set(holidayRows.map(h => h.holiday_date));

      const vendors = db.prepare('SELECT name, service_provided FROM vendors').all();

      const dates = [];
      for (let d = 1; d <= lastDay; d++) {
        dates.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }

      const deptMap = new Map();
      employees.forEach(emp => {
        const stats = { manHours: 0, present: 0, absent: 0, natHolWork: 0, compOff: 0, pubHol: 0, weekOff: 0 };

        dates.forEach(date => {
          const rec = attendanceMap.get(`${emp.id}|${date}`);
          let status, hours;
          if (rec) {
            status = rec.status;
            hours = rec.hours || 0;
          } else {
            // No explicit log: mirrors the daily-view default (department's fixed off-day, otherwise Absent)
            const weekday = new Date(date).toLocaleString('en-US', { weekday: 'long' });
            status = weekday === emp.fixedWeekOff ? 'Week Off' : 'Absent';
            hours = 0;
          }
          stats.manHours += hours;
          const isHoliday = holidaySet.has(date);
          if (status === 'Present') {
            if (isHoliday) stats.natHolWork++; else stats.present++;
          } else if (status === 'Absent' || status === 'Leave') {
            stats.absent++;
          } else if (status === 'Comp Off') {
            stats.compOff++;
          } else if (status === 'Holiday') {
            stats.pubHol++;
          } else if (status === 'Week Off') {
            stats.weekOff++;
          }
        });

        const billDays = stats.present + stats.natHolWork + stats.compOff;
        const billNatHol = billDays + stats.pubHol;
        const deptName = emp.departmentName || 'Unassigned';

        if (!deptMap.has(deptName)) {
          deptMap.set(deptName, { departmentName: deptName, employees: [], designationTotals: new Map() });
        }
        const dept = deptMap.get(deptName);
        dept.employees.push({
          employeeCode: emp.employeeCode,
          name: emp.name,
          designation: emp.designationName || '-',
          manHours: Number(stats.manHours.toFixed(1)),
          present: stats.present,
          absent: stats.absent,
          natHolWork: stats.natHolWork,
          compOff: stats.compOff,
          pubHol: stats.pubHol,
          weekOff: stats.weekOff,
          billDays,
          billNatHol,
          f26Pres: stats.present
        });
        const desgKey = emp.designationName || '-';
        dept.designationTotals.set(desgKey, (dept.designationTotals.get(desgKey) || 0) + stats.manHours);
      });

      const departments = Array.from(deptMap.values()).map(dept => {
        const deptLower = dept.departmentName.toLowerCase();
        const vendor = vendors.find(v => (v.service_provided || '').toLowerCase().includes(deptLower));
        const totalManDays = dept.employees.reduce((sum, e) => sum + e.manHours, 0);
        return {
          departmentName: dept.departmentName,
          contractorName: vendor ? vendor.name : '-',
          employees: dept.employees,
          designationTotals: Array.from(dept.designationTotals.entries()).map(([designation, totalManDays]) => ({
            designation, totalManDays: Number(totalManDays.toFixed(1))
          })),
          totalManDays: Number(totalManDays.toFixed(1))
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          month: monthNames[m - 1],
          year: y,
          principalEmployer: 'Brookfield',
          site: employees[0].branch || '-',
          departments
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getReports(req, res) {
    try {
      const { startDate, endDate, departmentId, branch } = req.query;
      
      let attendanceJoinCondition = `a.employee_id = e.id`;
      const joinParams = [];
      
      if (startDate) {
        attendanceJoinCondition += ` AND a.attendance_date >= ?`;
        joinParams.push(startDate);
      }
      if (endDate) {
        attendanceJoinCondition += ` AND a.attendance_date <= ?`;
        joinParams.push(endDate);
      }
      
      let query = `
        SELECT 
          e.employee_code AS employeeCode,
          e.name AS employeeName,
          e.branch,
          dept.name AS departmentName,
          desg.name AS designationName,
          COALESCE(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END), 0) AS presentCount,
          COALESCE(SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END), 0) AS absentCount,
          COALESCE(SUM(CASE WHEN a.status = 'Leave' THEN 1 ELSE 0 END), 0) AS leaveCount,
          COALESCE(SUM(a.hours), 0) AS totalHours,
          CASE 
            WHEN COUNT(CASE WHEN a.status = 'Present' THEN 1 END) > 0 
            THEN ROUND(SUM(a.hours) / COUNT(CASE WHEN a.status = 'Present' THEN 1 END), 1)
            ELSE 0 
          END AS avgHours
        FROM employees e
        LEFT JOIN departments dept ON e.department_id = dept.id
        LEFT JOIN designations desg ON e.designation_id = desg.id
        LEFT JOIN attendance a ON ${attendanceJoinCondition}
      `;
      
      const whereConditions = [];
      const whereParams = [];
      
      if (departmentId && departmentId !== 'All') {
        whereConditions.push(`e.department_id = ?`);
        whereParams.push(Number(departmentId));
      }
      if (branch && branch !== 'All') {
        whereConditions.push(`e.branch = ?`);
        whereParams.push(branch);
      }
      
      if (whereConditions.length > 0) {
        query += ` WHERE ` + whereConditions.join(' AND ');
      }
      
      query += ` GROUP BY e.id ORDER BY e.employee_code ASC`;
      
      const params = [...joinParams, ...whereParams];
      const data = db.prepare(query).all(...params);
      
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
