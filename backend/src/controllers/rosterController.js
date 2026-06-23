import { rosterService } from '../services/rosterService.js';

export const rosterController = {
  getRoster(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = rosterService.getRoster(startDate, endDate);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  assignRoster(req, res) {
    try {
      const { employee_id, roster_date, shift_id } = req.body;
      if (!employee_id || !roster_date || !shift_id) {
        return res.status(400).json({ success: false, message: 'employee_id, roster_date, and shift_id are required' });
      }
      const data = rosterService.assignRoster(req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  removeRoster(req, res) {
    try {
      const { employeeId, date } = req.params;
      rosterService.removeRoster(employeeId, date, req.user.id);
      return res.status(200).json({ success: true, data: { status: 'Removed successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
