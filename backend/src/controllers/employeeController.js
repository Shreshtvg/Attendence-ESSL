import { employeeService } from '../services/employeeService.js';

export const employeeController = {
  getEmployees(req, res) {
    try {
      const filters = {
        search: req.query.search,
        department_id: req.query.department_id ? Number(req.query.department_id) : null,
        designation_id: req.query.designation_id ? Number(req.query.designation_id) : null,
        shift_id: req.query.shift_id ? Number(req.query.shift_id) : null,
        branch: req.query.branch,
        status: req.query.status
      };
      const data = employeeService.getEmployees(filters);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getEmployee(req, res) {
    try {
      const data = employeeService.getEmployee(req.params.id);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  createEmployee(req, res) {
    try {
      const data = employeeService.createEmployee(req.body, req.user.id);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  updateEmployee(req, res) {
    try {
      const data = employeeService.updateEmployee(req.params.id, req.body, req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteEmployee(req, res) {
    try {
      const ok = employeeService.deleteEmployee(req.params.id, req.user.id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, data: { status: 'Deleted successfully' } });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
