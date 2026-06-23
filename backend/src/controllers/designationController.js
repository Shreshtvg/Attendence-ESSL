import { designationService } from '../services/designationService.js';

export const designationController = {
  getDesignations(req, res) {
    try {
      const data = designationService.getDesignations();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getDesignation(req, res) {
    try {
      const data = designationService.getDesignation(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Designation not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createDesignation(req, res) {
    try {
      const data = designationService.createDesignation(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateDesignation(req, res) {
    try {
      const data = designationService.updateDesignation(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteDesignation(req, res) {
    try {
      const ok = designationService.deleteDesignation(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Designation not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
