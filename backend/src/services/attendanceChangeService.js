import { attendanceChangeRepository } from '../repositories/attendanceChangeRepository.js';
import { attendanceRepository } from '../repositories/attendanceRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import { calculateHours } from '../utils/time.js';

export const attendanceChangeService = {
  getChanges() {
    return attendanceChangeRepository.findAll();
  },

  createChange(req, userId) {
    const newChange = attendanceChangeRepository.create(req);
    activityLogRepository.log(`Attendance correction request submitted for Employee ID ${req.employee_id} date ${req.attendance_date}`, 'Info', userId);
    return newChange;
  },

  approveChange(id, status, userId) {
    const original = attendanceChangeRepository.findById(id);
    if (!original) {
      throw new Error('Correction request not found');
    }

    const updated = attendanceChangeRepository.updateStatus(id, status, userId);
    activityLogRepository.log(`Attendance correction #${id} was ${status} by user #${userId}`, 'Info', userId);

    // If approved, update the actual attendance row
    if (status === 'Approved') {
      const hours = calculateHours(original.requested_check_in, original.requested_check_out);
      attendanceRepository.save({
        employee_id: original.employee_id,
        attendance_date: original.attendance_date,
        check_in: original.requested_check_in,
        check_out: original.requested_check_out,
        hours,
        status: 'Present' // Marked as Present if we have corrected times
      });
      activityLogRepository.log(`Attendance logs automatically updated for employee ID ${original.employee_id} on ${original.attendance_date} with corrected times`, 'Info', userId);
    }

    return updated;
  },

  deleteChange(id, userId) {
    const result = attendanceChangeRepository.delete(id);
    if (result) {
      activityLogRepository.log(`Correction request #${id} deleted`, 'Info', userId);
    }
    return result;
  }
};
