import { holidayRepository } from '../repositories/holidayRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const holidayService = {
  getHolidays() {
    return holidayRepository.findAll();
  },

  getHoliday(id) {
    return holidayRepository.findById(id);
  },

  createHoliday(holiday, userId) {
    const newHoliday = holidayRepository.create(holiday);
    activityLogRepository.log(`Holiday '${newHoliday.name}' on ${newHoliday.holiday_date} declared`, 'Info', userId);
    return newHoliday;
  },

  updateHoliday(id, holiday, userId) {
    const updated = holidayRepository.update(id, holiday);
    activityLogRepository.log(`Holiday '${updated.name}' renamed / moved to ${updated.holiday_date}`, 'Info', userId);
    return updated;
  },

  deleteHoliday(id, userId) {
    const holiday = holidayRepository.findById(id);
    const result = holidayRepository.delete(id);
    if (result && holiday) {
      activityLogRepository.log(`Holiday '${holiday.name}' on ${holiday.holiday_date} deleted`, 'Info', userId);
    }
    return result;
  }
};
