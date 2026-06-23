import { departmentRepository } from '../repositories/departmentRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const departmentService = {
  getDepartments() {
    return departmentRepository.findAll();
  },

  getDepartment(id) {
    return departmentRepository.findById(id);
  },

  createDepartment(dept, userId) {
    const newDept = departmentRepository.create(dept);
    activityLogRepository.log(`Department '${newDept.name}' created`, 'Info', userId);
    return newDept;
  },

  updateDepartment(id, dept, userId) {
    const updated = departmentRepository.update(id, dept);
    activityLogRepository.log(`Department '${updated.name}' details updated`, 'Info', userId);
    return updated;
  },

  deleteDepartment(id, userId) {
    const dept = departmentRepository.findById(id);
    const result = departmentRepository.delete(id);
    if (result && dept) {
      activityLogRepository.log(`Department '${dept.name}' deleted`, 'Info', userId);
    }
    return result;
  }
};
