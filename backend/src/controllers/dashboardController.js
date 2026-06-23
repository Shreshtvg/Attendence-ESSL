import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  getStats(req, res) {
    try {
      const data = dashboardService.getStatistics();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
