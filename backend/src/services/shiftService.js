import { shiftRepository } from '../repositories/shiftRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const shiftService = {
  getShifts() {
    return shiftRepository.findAll();
  },

  getShift(id) {
    return shiftRepository.findById(id);
  },

  createShift(shift, userId) {
    const newShift = shiftRepository.create(shift);
    activityLogRepository.log(`Shift '${newShift.name}' (${newShift.start_time}-${newShift.end_time}) was created`, 'Info', userId);
    return newShift;
  },

  updateShift(id, shift, userId) {
    const updated = shiftRepository.update(id, shift);
    activityLogRepository.log(`Shift '${updated.name}' was updated to ${updated.start_time}-${updated.end_time}`, 'Info', userId);
    return updated;
  },

  deleteShift(id, userId) {
    const shift = shiftRepository.findById(id);
    const result = shiftRepository.delete(id);
    if (result && shift) {
      activityLogRepository.log(`Shift '${shift.name}' was deleted`, 'Info', userId);
    }
    return result;
  }
};
