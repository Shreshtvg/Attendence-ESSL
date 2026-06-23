import { shiftService } from '../services/shiftService.js';

export const shiftController = {
  getShifts(req, res) {
    try {
      const data = shiftService.getShifts();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getShift(req, res) {
    try {
      const data = shiftService.getShift(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Shift not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createShift(req, res) {
    try {
      const data = shiftService.createShift(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateShift(req, res) {
    try {
      const data = shiftService.updateShift(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteShift(req, res) {
    try {
      const ok = shiftService.deleteShift(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Shift not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
