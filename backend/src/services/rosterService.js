import { rosterRepository } from '../repositories/rosterRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const rosterService = {
  getRoster(startDate, endDate) {
    return rosterRepository.findAll(startDate, endDate);
  },

  assignRoster(roster, userId) {
    const assigned = rosterRepository.assign(roster);
    activityLogRepository.log(`Shift assigned via roster to employee ID ${roster.employee_id} for ${roster.roster_date}`, 'Info', userId);
    return assigned;
  },

  removeRoster(employeeId, date, userId) {
    const result = rosterRepository.delete(employeeId, date);
    if (result) {
      activityLogRepository.log(`Roster entry removed for employee ID ${employeeId} on ${date}`, 'Info', userId);
    }
    return result;
  }
};
