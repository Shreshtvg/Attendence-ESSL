import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const activityLogController = {
  getLogs(req, res) {
    try {
      const data = activityLogRepository.findAll();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
