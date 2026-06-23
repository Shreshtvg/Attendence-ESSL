import { holidayService } from '../services/holidayService.js';

export const holidayController = {
  getHolidays(req, res) {
    try {
      const data = holidayService.getHolidays();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getHoliday(req, res) {
    try {
      const data = holidayService.getHoliday(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Holiday not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createHoliday(req, res) {
    try {
      const { holiday_date, name } = req.body;
      if (!holiday_date || !name) {
        return res.status(400).json({ success: false, message: 'holiday_date and name are required' });
      }
      const data = holidayService.createHoliday(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateHoliday(req, res) {
    try {
      const data = holidayService.updateHoliday(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteHoliday(req, res) {
    try {
      const ok = holidayService.deleteHoliday(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Holiday not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
