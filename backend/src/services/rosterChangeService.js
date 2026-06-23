import { rosterChangeRepository } from '../repositories/rosterChangeRepository.js';
import db from '../database/db.js';

export const rosterChangeService = {
  getRequests() {
    return rosterChangeRepository.findAll();
  },

  createRequest(data, userId) {
    return rosterChangeRepository.create({ ...data, requested_by: userId });
  },

  reviewRequest(id, status, userId) {
    const req = rosterChangeRepository.findById(id);
    if (!req) throw new Error('Roster change request not found');

    rosterChangeRepository.updateStatus(id, status, userId);

    if (status === 'Approved') {
      if (req.requested_status === 'W') {
        db.prepare('INSERT OR REPLACE INTO rosters (employee_id, roster_date, shift_id) VALUES (?, ?, 1)')
          .run(req.employee_id, req.roster_date);
      } else {
        db.prepare('DELETE FROM rosters WHERE employee_id = ? AND roster_date = ?')
          .run(req.employee_id, req.roster_date);
      }
    }

    return rosterChangeRepository.findById(id);
  }
};
