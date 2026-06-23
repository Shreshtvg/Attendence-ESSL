import { attendanceService } from '../services/attendanceService.js';

export const attendanceController = {
  getAttendance(req, res) {
    try {
      const date = req.query.date || new Date().toISOString().split('T')[0];
      const departmentId = req.query.department_id ? Number(req.query.department_id) : null;
      const data = attendanceService.getAttendanceByDate(date, departmentId);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  updateAttendance(req, res) {
    try {
      if (!req.body.employeeId || !req.body.attendanceDate || !req.body.status) {
        return res.status(400).json({ success: false, message: 'employeeId, attendanceDate, and status are required' });
      }
      const data = attendanceService.updateAttendance(req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  getSummary(req, res) {
    try {
      const date = req.query.date || new Date().toISOString().split('T')[0];
      const data = attendanceService.getSummary(date);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
