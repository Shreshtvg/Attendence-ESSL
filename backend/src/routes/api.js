import express from 'express';
import { authController } from '../controllers/authController.js';
import { departmentController } from '../controllers/departmentController.js';
import { designationController } from '../controllers/designationController.js';
import { shiftController } from '../controllers/shiftController.js';
import { employeeController } from '../controllers/employeeController.js';
import { attendanceController } from '../controllers/attendanceController.js';
import { leaveController } from '../controllers/leaveController.js';
import { attendanceChangeController } from '../controllers/attendanceChangeController.js';
import { rosterController } from '../controllers/rosterController.js';
import { rosterChangeController } from '../controllers/rosterChangeController.js';
import { holidayController } from '../controllers/holidayController.js';
import { vendorController } from '../controllers/vendorController.js';
import { dashboardController } from '../controllers/dashboardController.js';
import { activityLogController } from '../controllers/activityLogController.js';
import { reportController } from '../controllers/reportController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// ==========================================
// PUBLIC & AUTHENTICATION ROUTES
// ==========================================
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register); // Admin or system registration
router.get('/auth/check-email', authController.checkEmail);
router.get('/auth/me', authenticateToken, authController.getMe);

// ==========================================
// SECURE ENDPOINTS (Requires Auth)
// ==========================================
router.use(authenticateToken);

// Dashboard
router.get('/dashboard/stats', dashboardController.getStats);

// Activity Logs
router.get('/activity-logs', activityLogController.getLogs);

// Departments CRUD
router.get('/departments', departmentController.getDepartments);
router.get('/departments/:id', departmentController.getDepartment);
router.post('/departments', authorizeRoles('Admin', 'Supervisor'), departmentController.createDepartment);
router.put('/departments/:id', authorizeRoles('Admin', 'Supervisor'), departmentController.updateDepartment);
router.delete('/departments/:id', authorizeRoles('Admin', 'Supervisor'), departmentController.deleteDepartment);

// Designations CRUD
router.get('/designations', designationController.getDesignations);
router.get('/designations/:id', designationController.getDesignation);
router.post('/designations', authorizeRoles('Admin', 'Supervisor'), designationController.createDesignation);
router.put('/designations/:id', authorizeRoles('Admin', 'Supervisor'), designationController.updateDesignation);
router.delete('/designations/:id', authorizeRoles('Admin', 'Supervisor'), designationController.deleteDesignation);

// Shifts CRUD
router.get('/shifts', shiftController.getShifts);
router.get('/shifts/:id', shiftController.getShift);
router.post('/shifts', authorizeRoles('Admin', 'Supervisor'), shiftController.createShift);
router.put('/shifts/:id', authorizeRoles('Admin', 'Supervisor'), shiftController.updateShift);
router.delete('/shifts/:id', authorizeRoles('Admin', 'Supervisor'), shiftController.deleteShift);

// Employees CRUD
router.get('/employees', employeeController.getEmployees);
router.get('/employees/:id', employeeController.getEmployee);
router.post('/employees', authorizeRoles('Admin', 'Supervisor'), employeeController.createEmployee);
router.put('/employees/:id', authorizeRoles('Admin', 'Supervisor'), employeeController.updateEmployee);
router.delete('/employees/:id', authorizeRoles('Admin', 'Supervisor'), employeeController.deleteEmployee);

// Attendance Entries
router.get('/attendance', attendanceController.getAttendance);
router.get('/attendance/summary', attendanceController.getSummary);
router.post('/attendance', authorizeRoles('Admin', 'Supervisor'), attendanceController.updateAttendance);

// Leave Requests Workflow
router.get('/leaves', leaveController.getLeaves);
router.post('/leaves', leaveController.createLeave);
router.patch('/leaves/:id', authorizeRoles('Admin', 'Supervisor'), leaveController.updateLeave);
router.delete('/leaves/:id', authorizeRoles('Admin'), leaveController.deleteLeave);

// Attendance Change (Punch Corrections) Workflow
router.get('/changes', attendanceChangeController.getChanges);
router.post('/changes', attendanceChangeController.createChange);
router.patch('/changes/:id', authorizeRoles('Admin'), attendanceChangeController.approveChange);
router.delete('/changes/:id', authorizeRoles('Admin'), attendanceChangeController.deleteChange);

// Aliases for /attendance-changes to support frontend calls
router.get('/attendance-changes', attendanceChangeController.getChanges);
router.post('/attendance-changes', attendanceChangeController.createChange);
router.patch('/attendance-changes/:id', authorizeRoles('Admin'), attendanceChangeController.approveChange);
router.delete('/attendance-changes/:id', authorizeRoles('Admin'), attendanceChangeController.deleteChange);

// Roster Shift Plannings
router.get('/rosters', rosterController.getRoster);
router.post('/rosters', authorizeRoles('Admin', 'Supervisor'), rosterController.assignRoster);
router.delete('/rosters/:employeeId/:date', authorizeRoles('Admin', 'Supervisor'), rosterController.removeRoster);

// Roster Change Requests (approval workflow)
router.get('/roster-changes', rosterChangeController.getRequests);
router.post('/roster-changes', authorizeRoles('Admin', 'Supervisor'), rosterChangeController.createRequest);
router.patch('/roster-changes/:id', authorizeRoles('Supervisor'), rosterChangeController.reviewRequest);

// Holidays CRUD
router.get('/holidays', holidayController.getHolidays);
router.get('/holidays/:id', holidayController.getHoliday);
router.post('/holidays', authorizeRoles('Admin'), holidayController.createHoliday);
router.put('/holidays/:id', authorizeRoles('Admin'), holidayController.updateHoliday);
router.delete('/holidays/:id', authorizeRoles('Admin'), holidayController.deleteHoliday);

// Vendors CRUD
router.get('/vendors', vendorController.getVendors);
router.get('/vendors/:id', vendorController.getVendor);
router.post('/vendors', authorizeRoles('Admin', 'Supervisor'), vendorController.createVendor);
router.put('/vendors/:id', authorizeRoles('Admin', 'Supervisor'), vendorController.updateVendor);
router.delete('/vendors/:id', authorizeRoles('Admin', 'Supervisor'), vendorController.deleteVendor);

// Reports aggregations
router.get('/reports', reportController.getReports);
router.get('/reports/attendance', reportController.getAttendanceReport);
router.get('/reports/leaves', reportController.getLeaveReport);
router.get('/reports/departments', reportController.getDepartmentReport);
router.get('/reports/vendors', reportController.getVendorReport);
router.get('/reports/monthly-attendance', reportController.getMonthlyAttendanceReport);

export default router;
