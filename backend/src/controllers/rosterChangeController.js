import { rosterChangeService } from '../services/rosterChangeService.js';

export const rosterChangeController = {
  getRequests(req, res) {
    try {
      const data = rosterChangeService.getRequests();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createRequest(req, res) {
    try {
      const { employee_id, roster_date, requested_status } = req.body;
      if (!employee_id || !roster_date || !requested_status) {
        return res.status(400).json({ success: false, message: 'employee_id, roster_date, and requested_status are required' });
      }
      const data = rosterChangeService.createRequest({ employee_id, roster_date, requested_status }, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  reviewRequest(req, res) {
    try {
      const { status } = req.body;
      if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
      }
      const data = rosterChangeService.reviewRequest(req.params.id, status, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
};
