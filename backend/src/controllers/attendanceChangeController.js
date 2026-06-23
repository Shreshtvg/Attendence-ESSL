import { attendanceChangeService } from '../services/attendanceChangeService.js';

export const attendanceChangeController = {
  getChanges(req, res) {
    try {
      const data = attendanceChangeService.getChanges();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createChange(req, res) {
    try {
      const { employee_id, attendance_date, requested_check_in, requested_check_out } = req.body;
      if (!employee_id || !attendance_date || !requested_check_in || !requested_check_out) {
        return res.status(400).json({ success: false, message: 'employee_id, attendance_date, requested_check_in, and requested_check_out are required' });
      }
      const data = attendanceChangeService.createChange(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  approveChange(req, res) {
    try {
      const { status } = req.body;
      if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
      }
      const data = attendanceChangeService.approveChange(req.params.id, status, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteChange(req, res) {
    try {
      const ok = attendanceChangeService.deleteChange(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
