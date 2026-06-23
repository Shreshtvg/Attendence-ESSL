import { leaveService } from '../services/leaveService.js';

export const leaveController = {
  getLeaves(req, res) {
    try {
      const data = leaveService.getLeaves();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createLeave(req, res) {
    try {
      if (!req.body.employee_id || !req.body.start_date || !req.body.end_date || !req.body.leave_type) {
        return res.status(400).json({ success: false, message: 'employee_id, start_date, end_date, and leave_type are required' });
      }
      const data = leaveService.createLeave(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateLeave(req, res) {
    try {
      if (req.user.role === 'Supervisor') {
        const { status } = req.body;
        if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Status must be Approved, Rejected, or Pending' });
        }
        const data = leaveService.approveLeave(req.params.id, status, req.user.id);
        return res.status(200).json({ success: true, data });
      } else {
        const { leave_type, start_date, end_date, reason } = req.body;
        if (!leave_type || !start_date || !end_date) {
          return res.status(400).json({ success: false, message: 'leave_type, start_date, and end_date are required' });
        }
        const data = leaveService.updateLeaveDetails(req.params.id, { leave_type, start_date, end_date, reason }, req.user.id);
        return res.status(200).json({ success: true, data });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteLeave(req, res) {
    try {
      const ok = leaveService.deleteLeave(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Leave request not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
