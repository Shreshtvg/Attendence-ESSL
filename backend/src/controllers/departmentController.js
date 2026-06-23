import { departmentService } from '../services/departmentService.js';

export const departmentController = {
  getDepartments(req, res) {
    try {
      const data = departmentService.getDepartments();
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getDepartment(req, res) {
    try {
      const data = departmentService.getDepartment(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Department not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createDepartment(req, res) {
    try {
      const data = departmentService.createDepartment(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateDepartment(req, res) {
    try {
      const data = departmentService.updateDepartment(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteDepartment(req, res) {
    try {
      const ok = departmentService.deleteDepartment(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Department not found or couldn\'t be deleted' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
