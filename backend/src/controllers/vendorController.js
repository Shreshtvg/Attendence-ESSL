import { vendorService } from '../services/vendorService.js';

export const vendorController = {
  getVendors(req, res) {
    try {
      const data = vendorService.getVendors();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getVendor(req, res) {
    try {
      const data = vendorService.getVendor(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createVendor(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Vendor name is required' });
      }
      const data = vendorService.createVendor(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateVendor(req, res) {
    try {
      const data = vendorService.updateVendor(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteVendor(req, res) {
    try {
      const ok = vendorService.deleteVendor(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Vendor not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
