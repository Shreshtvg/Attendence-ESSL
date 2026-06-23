import { attendanceRepository } from '../repositories/attendanceRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import { calculateHours } from '../utils/time.js';

export const attendanceService = {
  getAttendanceByDate(date, departmentId = null) {
    const raw = attendanceRepository.findByDate(date, departmentId);
    
    // Grouping by department for the UI
    const departmentsMap = {};
    const dayName = new Date(date).toLocaleString('en-US', { weekday: 'long' });

    raw.forEach(row => {
      const deptName = row.department_name || 'Unassigned';
      if (!departmentsMap[deptName]) {
        departmentsMap[deptName] = {
          departmentId: row.department_id,
          departmentName: deptName,
          employees: []
        };
      }

      // Calculate status if none logged standardly
      let status = row.status;
      let checkIn = row.check_in || '';
      let checkOut = row.check_out || '';
      let hours = row.hours || 0;

      if (!status) {
        if (row.fixed_week_off === dayName) {
          status = 'Week Off';
        } else {
          status = 'Absent';
        }
      }

      departmentsMap[deptName].employees.push({
        employeeId: row.employee_id,
        employeeCode: row.employee_code,
        employeeName: row.employee_name,
        designation: row.designation_name || 'Unassigned',
        branch: row.branch,
        shiftId: row.shift_id || null,
        attendanceId: row.attendance_id || null,
        attendanceDate: date,
        checkIn,
        checkOut,
        hours,
        status
      });
    });

    return Object.values(departmentsMap);
  },

  updateAttendance(record, userId) {
    const { employeeId, attendanceDate, checkIn, checkOut, status } = record;
    
    // Compute hours
    let hours = 0;
    if (status === 'Present') {
      hours = calculateHours(checkIn, checkOut);
    }

    const saved = attendanceRepository.save({
      employee_id: employeeId,
      attendance_date: attendanceDate,
      check_in: checkIn || null,
      check_out: checkOut || null,
      hours,
      status
    });

    activityLogRepository.log(`Attendance for employee ID ${employeeId} updated for date ${attendanceDate}. Status: ${status}`, 'Info', userId);
    return saved;
  },

  getSummary(date) {
    return attendanceRepository.getSummaryByDate(date);
  }
};
