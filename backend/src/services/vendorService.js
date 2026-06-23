import { vendorRepository } from '../repositories/vendorRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const vendorService = {
  getVendors() {
    return vendorRepository.findAll();
  },

  getVendor(id) {
    return vendorRepository.findById(id);
  },

  createVendor(vendor, userId) {
    const newVendor = vendorRepository.create(vendor);
    activityLogRepository.log(`Vendor contract added for '${newVendor.name}'`, 'Info', userId);
    return newVendor;
  },

  updateVendor(id, vendor, userId) {
    const updated = vendorRepository.update(id, vendor);
    activityLogRepository.log(`Vendor contract '${updated.name}' modified`, 'Info', userId);
    return updated;
  },

  deleteVendor(id, userId) {
    const vendor = vendorRepository.findById(id);
    const result = vendorRepository.delete(id);
    if (result && vendor) {
      activityLogRepository.log(`Vendor contract with '${vendor.name}' terminated`, 'Info', userId);
    }
    return result;
  }
};
