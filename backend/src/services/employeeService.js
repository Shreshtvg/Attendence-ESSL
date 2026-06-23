import { employeeRepository } from '../repositories/employeeRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const employeeService = {
  getEmployees(filters) {
    return employeeRepository.findAll(filters);
  },

  getEmployee(id) {
    return employeeRepository.findById(id);
  },

  createEmployee(emp, userId) {
    const newEmp = employeeRepository.create(emp);
    activityLogRepository.log(`Employee '${newEmp.name}' (${newEmp.employee_code}) was registered`, 'Info', userId);
    return newEmp;
  },

  updateEmployee(id, emp, userId) {
    const updated = employeeRepository.update(id, emp);
    activityLogRepository.log(`Employee '${updated.name}' details were updated`, 'Info', userId);
    return updated;
  },

  deleteEmployee(id, userId) {
    const emp = employeeRepository.findById(id);
    const result = employeeRepository.delete(id);
    if (result && emp) {
      activityLogRepository.log(`Employee '${emp.name}' (${emp.employee_code}) was deleted`, 'Info', userId);
    }
    return result;
  }
};
