import { leaveRepository } from '../repositories/leaveRepository.js';
import { attendanceRepository } from '../repositories/attendanceRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const leaveService = {
  getLeaves() {
    return leaveRepository.findAll();
  },

  createLeave(req, userId) {
    const newLeave = leaveRepository.create(req);
    activityLogRepository.log(`Leave request submitted for Employee ID ${req.employee_id} (${req.start_date} to ${req.end_date})`, 'Info', userId);
    return newLeave;
  },

  updateLeaveDetails(id, details, userId) {
    const original = leaveRepository.findById(id);
    if (!original) throw new Error('Leave request not found');
    const updated = leaveRepository.updateDetails(id, details);
    activityLogRepository.log(`Leave request #${id} details updated by user #${userId}`, 'Info', userId);
    return updated;
  },

  approveLeave(id, status, userId) {
    const original = leaveRepository.findById(id);
    if (!original) {
      throw new Error('Leave request not found');
    }

    const updated = leaveRepository.updateStatus(id, status, userId);
    activityLogRepository.log(`Leave request #${id} was ${status} by user #${userId}`, 'Info', userId);

    // If approved, let's insert 'Leave' into the attendance table for all dates in the range!
    if (status === 'Approved') {
      const start = new Date(original.start_date);
      const end = new Date(original.end_date);
      
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dateStr = day.toISOString().split('T')[0];
        try {
          attendanceRepository.save({
            employee_id: original.employee_id,
            attendance_date: dateStr,
            check_in: null,
            check_out: null,
            hours: 0,
            status: 'Leave'
          });
        } catch (err) {
          console.error(`Failed to auto-insert attendance leave for ${dateStr}`, err);
        }
      }
    }

    return updated;
  },

  deleteLeave(id, userId) {
    const result = leaveRepository.delete(id);
    if (result) {
      activityLogRepository.log(`Leave request #${id} deleted`, 'Info', userId);
    }
    return result;
  }
};
