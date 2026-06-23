import { designationRepository } from '../repositories/designationRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const designationService = {
  getDesignations() {
    return designationRepository.findAll();
  },

  getDesignation(id) {
    return designationRepository.findById(id);
  },

  createDesignation(desg, userId) {
    const newDesg = designationRepository.create(desg);
    activityLogRepository.log(`Designation '${newDesg.name}' was created`, 'Info', userId);
    return newDesg;
  },

  updateDesignation(id, desg, userId) {
    const updated = designationRepository.update(id, desg);
    activityLogRepository.log(`Designation '${updated.name}' was updated`, 'Info', userId);
    return updated;
  },

  deleteDesignation(id, userId) {
    const desg = designationRepository.findById(id);
    const result = designationRepository.delete(id);
    if (result && desg) {
      activityLogRepository.log(`Designation '${desg.name}' was deleted`, 'Info', userId);
    }
    return result;
  }
};
