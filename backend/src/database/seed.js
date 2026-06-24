import bcryptjs from 'bcryptjs';
import db from './db.js';

export function runSeed() {
  const existingUser = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUser.count > 0) {
    console.log('Database already seeded. Checking today\'s attendance...');
    ensureTodayAttendance();
    return;
  }

  console.log('Seeding Eco World enterprise data for Attendix ERP...');

  const adminPassword = bcryptjs.hashSync('Admin@123', 10);
  const supPassword   = bcryptjs.hashSync('Sup@12345', 10);

  // ── 1. Users ────────────────────────────────────────────────────────────────
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  insertUser.run('Rajesh Menon',       'rajesh.menon@ecoworld.in',       adminPassword, 'Admin');
  insertUser.run('Priya Nair',         'priya.nair@ecoworld.in',         supPassword,   'Supervisor');
  insertUser.run('Karthik Subramaniam','karthik.sub@ecoworld.in',        supPassword,   'Supervisor');

  // ── 2. Departments ──────────────────────────────────────────────────────────
  const insertDept = db.prepare('INSERT INTO departments (name, description, fixed_week_off) VALUES (?, ?, ?)');
  const dSec   = insertDept.run('Security',           'Security force and access control',         'Sunday').lastInsertRowid;
  const dProp  = insertDept.run('Property Management','Facility operations and property upkeep',    'Sunday').lastInsertRowid;
  const dStp   = insertDept.run('STP',                'Sewage Treatment Plant operations',          'Saturday').lastInsertRowid;
  const dTech  = insertDept.run('Technical',          'Electrical, plumbing & MEP engineering',    'Sunday').lastInsertRowid;
  const dHkp   = insertDept.run('Housekeeping',       'Premises hygiene and cleanliness',          'Sunday').lastInsertRowid;
  const dWaste = insertDept.run('Waste Management',   'Solid & liquid waste handling',             'Sunday').lastInsertRowid;
  const dHort  = insertDept.run('Horticulture',       'Landscape, greenery & garden maintenance',  'Sunday').lastInsertRowid;
  const dPark  = insertDept.run('Parking Management', 'Parking bays, valet & vehicle management', 'Sunday').lastInsertRowid;

  // ── 3. Designations ─────────────────────────────────────────────────────────
  const insertDesg = db.prepare('INSERT INTO designations (name, department_id) VALUES (?, ?)');
  const desgSecOfficer = insertDesg.run('Security Officer',    dSec).lastInsertRowid;
  const desgSecSuperv  = insertDesg.run('Security Supervisor', dSec).lastInsertRowid;
  const desgSecGuard   = insertDesg.run('Security Guard',      dSec).lastInsertRowid;
  const desgFacMgr     = insertDesg.run('Facility Manager',    dProp).lastInsertRowid;
  const desgFacExec    = insertDesg.run('Facility Executive',  dProp).lastInsertRowid;
  const desgShiftEng   = insertDesg.run('Shift Engineer',      dProp).lastInsertRowid;
  const desgStp        = insertDesg.run('STP Operator',        dStp).lastInsertRowid;
  const desgElec       = insertDesg.run('Electrician',         dTech).lastInsertRowid;
  const desgTechnicn   = insertDesg.run('Technician',          dTech).lastInsertRowid;
  const desgWaterBody  = insertDesg.run('Water Body Operator', dTech).lastInsertRowid;
  const desgHkpLead    = insertDesg.run('Housekeeping Lead',   dHkp).lastInsertRowid;
  const desgHkpStaff   = insertDesg.run('Housekeeping Staff',  dHkp).lastInsertRowid;
  const desgHkpJanitor = insertDesg.run('Sr. HK Janitor',      dHkp).lastInsertRowid;
  const desgPantryLady = insertDesg.run('Pantry Lady',         dHkp).lastInsertRowid;
  const desgWasteHndlr = insertDesg.run('Waste Handler',       dWaste).lastInsertRowid;
  const desgFieldStaff = insertDesg.run('Field Staff',         dWaste).lastInsertRowid;
  const desgWasteSup   = insertDesg.run('Supervisor',          dWaste).lastInsertRowid;
  const desgHort       = insertDesg.run('Horticulturist',      dHort).lastInsertRowid;
  const desgGardener   = insertDesg.run('Gardener',            dHort).lastInsertRowid;
  const desgGardenSup  = insertDesg.run('Garden Supervisor',   dHort).lastInsertRowid;
  const desgParkMrshl  = insertDesg.run('Parking Marshal',     dPark).lastInsertRowid;
  const desgDriver     = insertDesg.run('Driver',              dPark).lastInsertRowid;

  // ── 4. Shifts ───────────────────────────────────────────────────────────────
  const insertShift = db.prepare('INSERT INTO shifts (name, start_time, end_time) VALUES (?, ?, ?)');
  const shiftGen   = insertShift.run('General Shift', '09:00', '18:00').lastInsertRowid;
  const shiftMorn  = insertShift.run('Morning Shift', '06:00', '14:00').lastInsertRowid;
  const shiftNight = insertShift.run('Night Shift',   '22:00', '06:00').lastInsertRowid;

  // ── 5. Holidays ─────────────────────────────────────────────────────────────
  const insertHoliday = db.prepare('INSERT INTO holidays (holiday_date, name, description) VALUES (?, ?, ?)');
  insertHoliday.run('2026-01-01', 'New Year Day',     'National rest day');
  insertHoliday.run('2026-01-26', 'Republic Day',     'National Republic Holiday');
  insertHoliday.run('2026-05-01', 'Labour Day',       'International Workers Day');
  insertHoliday.run('2026-08-15', 'Independence Day', 'National Independence Holiday');
  insertHoliday.run('2026-10-02', 'Gandhi Jayanti',   'National Holiday');
  insertHoliday.run('2026-11-14', 'Diwali',           'Festival of Lights');
  insertHoliday.run('2026-12-25', 'Christmas Day',    'Annual Christmas Holiday');

  // ── 6. Vendors ──────────────────────────────────────────────────────────────
  const insertVendor = db.prepare('INSERT INTO vendors (name, contact_person, email, phone, service_provided) VALUES (?, ?, ?, ?, ?)');
  insertVendor.run('JLL India Pvt Ltd',       'Aravind Rajan',    'aravind.rajan@jll.com',      '9880297101', 'Property Management');
  insertVendor.run('Amazing Blooms',          'Denita Fernandes', 'amazingbloomsrd@yahoo.in',   '9854517355', 'Horticulture');
  insertVendor.run('247 Facility Solutions',  'Mohan Pillai',     'mohan.pillai@247fspl.com',   '9741230045', 'Housekeeping');
  insertVendor.run('Saahas Waste Management', 'Swetha Krishnan',  'swetha@saahaszerowaste.org', '9845001234', 'Waste Management');
  insertVendor.run('Voltas Limited',          'Suresh Iyer',      'suresh.iyer@voltas.com',     '9900112233', 'Technical / HVAC');
  insertVendor.run('G4S Security Services',   'Ramesh Nambiar',   'ramesh.nambiar@g4s.com',     '9811009988', 'Security Services');

  // ── 7. Employees ────────────────────────────────────────────────────────────
  const BRANCH = 'EcoWorld';
  const insertEmp = db.prepare(`
    INSERT INTO employees (employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let phoneBase = 9845100001;
  const empIdMap = {};

  function addEmp(code, name, deptId, desgId, shiftId, status = 'Active') {
    const slug = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    const email = `${slug}@ecoworld.in`;
    const phone = String(phoneBase++);
    try {
      const res = insertEmp.run(code, name, email, phone, deptId, desgId, shiftId, BRANCH, status);
      empIdMap[name] = res.lastInsertRowid;
      return res.lastInsertRowid;
    } catch (e) {
      console.error(`Failed to insert: ${name} (${code}) — ${e.message}`);
      throw e;
    }
  }

  // ── SECURITY (Active: 12) ──────────────────────────────────────────────────
  addEmp('55558',      'Hiren Malo',     dSec, desgSecGuard,  shiftGen);
  addEmp('EW-SEC-001', 'Suresh Babu',   dSec, desgSecGuard,  shiftGen);
  addEmp('EW-SEC-002', 'Vinod Kumar',   dSec, desgSecGuard,  shiftNight);
  addEmp('EW-SEC-003', 'Arjun Singh',   dSec, desgSecGuard,  shiftMorn);
  addEmp('EW-SEC-004', 'Ravi Shankar',  dSec, desgSecSuperv, shiftGen);
  addEmp('EW-SEC-005', 'Mohammed Arif', dSec, desgSecGuard,  shiftNight);
  addEmp('EW-SEC-006', 'Bikram Thapa',  dSec, desgSecGuard,  shiftMorn);
  addEmp('EW-SEC-007', 'Sunil Tamang',  dSec, desgSecGuard,  shiftGen);
  addEmp('EW-SEC-008', 'Deepak Rai',    dSec, desgSecGuard,  shiftNight);
  addEmp('EW-SEC-009', 'Mohan Gurung',  dSec, desgSecGuard,  shiftMorn);
  addEmp('EW-SEC-010', 'Raju Lama',     dSec, desgSecOfficer,shiftGen);
  addEmp('EW-SEC-011', 'Rajesh Paswan', dSec, desgSecGuard,  shiftGen);

  // ── PROPERTY MANAGEMENT (Active: 8) ───────────────────────────────────────
  addEmp('458261',      'Shankar H Y',         dProp, desgShiftEng, shiftGen);
  addEmp('563251',      'Naresh Kumar Jyothi', dProp, desgFacExec,  shiftGen);
  addEmp('EW-PROP-001', 'Arun Menon',          dProp, desgFacMgr,   shiftGen);
  addEmp('EW-PROP-002', 'Bindhu Nair',         dProp, desgFacExec,  shiftGen);
  addEmp('EW-PROP-003', 'Chandrika Pillai',    dProp, desgShiftEng, shiftGen);
  addEmp('EW-PROP-004', 'Dileesh Kumar',       dProp, desgFacExec,  shiftGen);
  addEmp('EW-PROP-005', 'Elsa Mathew',         dProp, desgFacExec,  shiftGen);
  addEmp('EW-PROP-006', 'Faisal Khan',         dProp, desgShiftEng, shiftGen);

  // ── STP (Active: 5) ───────────────────────────────────────────────────────
  addEmp('1512', 'Joseph',         dStp, desgStp, shiftMorn);
  addEmp('1314', 'Ranganatha R',   dStp, desgStp, shiftMorn);
  addEmp('1311', 'Kammari Suresh', dStp, desgStp, shiftMorn);
  addEmp('1317', 'Chandre Gowda',  dStp, desgStp, shiftMorn);
  addEmp('2212', 'Gajendra',       dStp, desgStp, shiftMorn);

  // ── TECHNICAL (Active: 7) ─────────────────────────────────────────────────
  addEmp('12165',       'Aslam',         dTech, desgWaterBody, shiftGen);
  addEmp('EW-TECH-001', 'Abdul Hameed',  dTech, desgElec,      shiftGen);
  addEmp('EW-TECH-002', 'Babu Raj',      dTech, desgTechnicn,  shiftGen);
  addEmp('EW-TECH-003', 'Chandrashekar', dTech, desgElec,      shiftGen);
  addEmp('EW-TECH-004', 'Dinesh Mohan',  dTech, desgTechnicn,  shiftGen);
  addEmp('EW-TECH-005', 'Eswaran P',     dTech, desgElec,      shiftGen);
  addEmp('EW-TECH-006', 'Francis Joseph',dTech, desgTechnicn,  shiftGen);

  // ── HOUSEKEEPING (Active: 15) ─────────────────────────────────────────────
  addEmp('48529',      'Altaf Hussain',    dHkp, desgHkpStaff,   shiftGen);
  addEmp('51691',      'Rahamat Ali',      dHkp, desgHkpStaff,   shiftGen);
  addEmp('54002',      'Shambhunath',      dHkp, desgHkpStaff,   shiftGen);
  addEmp('53568',      'Santush Das',      dHkp, desgHkpStaff,   shiftGen);
  addEmp('56206',      'Dulal Uddin',      dHkp, desgHkpStaff,   shiftGen);
  addEmp('56690',      'Khandakar',        dHkp, desgHkpStaff,   shiftGen);
  addEmp('42448',      'Nandu',            dHkp, desgHkpJanitor, shiftGen);
  addEmp('43911',      'Babanna',          dHkp, desgHkpJanitor, shiftGen);
  addEmp('42375',      'Bharamappa',       dHkp, desgHkpJanitor, shiftGen);
  addEmp('45294',      'Tabita Nag',       dHkp, desgPantryLady, shiftGen);
  addEmp('EW-HKP-001', 'Sushila Devi',    dHkp, desgHkpStaff,   shiftGen);
  addEmp('EW-HKP-002', 'Hanumantha Reddy',dHkp, desgHkpLead,    shiftGen);
  addEmp('EW-HKP-003', 'Anjali Sharma',   dHkp, desgHkpStaff,   shiftGen);
  addEmp('EW-HKP-004', 'Rekha Patel',     dHkp, desgHkpStaff,   shiftGen);
  addEmp('EW-HKP-005', 'Lalitha Bai',     dHkp, desgHkpStaff,   shiftGen);

  // ── WASTE MANAGEMENT (Active: 5) ──────────────────────────────────────────
  addEmp('920',         'Mallikarjun',    dWaste, desgFieldStaff, shiftMorn);
  addEmp('635',         'Maneendra',      dWaste, desgWasteSup,   shiftMorn);
  addEmp('EW-WMST-001', 'Amarjeet Singh', dWaste, desgWasteHndlr, shiftMorn);
  addEmp('EW-WMST-002', 'Bhupinder Kumar',dWaste, desgWasteHndlr, shiftMorn);
  addEmp('EW-WMST-003', 'Charan Singh',   dWaste, desgWasteHndlr, shiftMorn);

  // ── HORTICULTURE (Active: 6) ──────────────────────────────────────────────
  addEmp('3266',        'Hanumantha',   dHort, desgGardener,  shiftMorn);
  addEmp('2519',        'Puttaraj',     dHort, desgGardener,  shiftMorn);
  addEmp('2905',        'Srinivas',     dHort, desgGardener,  shiftMorn);
  addEmp('2434',        'Sushila',      dHort, desgGardenSup, shiftMorn);
  addEmp('EW-HORT-001', 'Annamalai R',  dHort, desgHort,      shiftMorn);
  addEmp('EW-HORT-002', 'Boopalan S',   dHort, desgGardener,  shiftMorn);

  // ── PARKING MANAGEMENT (Active: 6) ────────────────────────────────────────
  addEmp('25021',       'Shib Sankar',   dPark, desgDriver,    shiftGen);
  addEmp('EW-PARK-001', 'Aakash Pandey', dPark, desgParkMrshl, shiftGen);
  addEmp('EW-PARK-002', 'Bhushan Patil', dPark, desgParkMrshl, shiftGen);
  addEmp('EW-PARK-003', 'Chetan Sawant', dPark, desgParkMrshl, shiftGen);
  addEmp('EW-PARK-004', 'Dhruv Kulkarni',dPark, desgParkMrshl, shiftGen);
  addEmp('EW-PARK-005', 'Eknath Jadhav', dPark, desgParkMrshl, shiftGen);

  // ── INACTIVE EMPLOYEES ────────────────────────────────────────────────────
  const inactive = [
    // STP
    { code: '2246', name: 'Shivaraja K',      dept: dStp,  desg: desgStp,       shift: shiftMorn },
    { code: '2240', name: 'Shivanna C',       dept: dStp,  desg: desgStp,       shift: shiftMorn },
    { code: '2485', name: 'Azmir Hussain',    dept: dStp,  desg: desgStp,       shift: shiftMorn },
    // Security
    { code: 'EW-SEC-012', name: 'Sanjay Kumar Singh', dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-013', name: 'Amit Prasad',         dept: dSec, desg: desgSecGuard,  shift: shiftNight },
    { code: 'EW-SEC-014', name: 'Dinesh Mandal',        dept: dSec, desg: desgSecGuard,  shift: shiftMorn },
    { code: 'EW-SEC-015', name: 'Govind Mahato',        dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-016', name: 'Pramod Sharma',        dept: dSec, desg: desgSecGuard,  shift: shiftNight },
    { code: 'EW-SEC-017', name: 'Satish Gupta',         dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-018', name: 'Ramesh Chandra',       dept: dSec, desg: desgSecGuard,  shift: shiftMorn },
    { code: 'EW-SEC-019', name: 'Bhola Nath',           dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-020', name: 'Kanhaiya Lal',         dept: dSec, desg: desgSecGuard,  shift: shiftNight },
    { code: 'EW-SEC-021', name: 'Manoj Tiwari',         dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-022', name: 'Ajay Verma',           dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-023', name: 'Vikas Yadav',          dept: dSec, desg: desgSecGuard,  shift: shiftMorn },
    { code: 'EW-SEC-024', name: 'Rakesh Mishra',        dept: dSec, desg: desgSecGuard,  shift: shiftNight },
    { code: 'EW-SEC-025', name: 'Pankaj Dubey',         dept: dSec, desg: desgSecGuard,  shift: shiftGen },
    { code: 'EW-SEC-026', name: 'Suresh Pal',           dept: dSec, desg: desgSecSuperv, shift: shiftGen },
    // Property Management
    { code: 'EW-PROP-007', name: 'Geetha Krishnan',    dept: dProp, desg: desgFacExec,  shift: shiftGen },
    { code: 'EW-PROP-008', name: 'Hari Prasad',        dept: dProp, desg: desgShiftEng, shift: shiftGen },
    { code: 'EW-PROP-009', name: 'Indira Suresh',      dept: dProp, desg: desgFacExec,  shift: shiftGen },
    { code: 'EW-PROP-010', name: 'Jayakumar M',        dept: dProp, desg: desgFacMgr,   shift: shiftGen },
    { code: 'EW-PROP-011', name: 'Kavitha Rajan',      dept: dProp, desg: desgFacExec,  shift: shiftGen },
    { code: 'EW-PROP-012', name: 'Lakshmi Devi',       dept: dProp, desg: desgFacExec,  shift: shiftGen },
    // Technical
    { code: 'EW-TECH-007', name: 'Ganapathi R',        dept: dTech, desg: desgTechnicn,  shift: shiftGen },
    { code: 'EW-TECH-008', name: 'Harish Naidu',       dept: dTech, desg: desgElec,      shift: shiftGen },
    { code: 'EW-TECH-009', name: 'Ibrahim Shaikh',     dept: dTech, desg: desgTechnicn,  shift: shiftGen },
    { code: 'EW-TECH-010', name: 'Javed Akhtar',       dept: dTech, desg: desgElec,      shift: shiftGen },
    { code: 'EW-TECH-011', name: 'Kiran Reddy',        dept: dTech, desg: desgTechnicn,  shift: shiftGen },
    { code: 'EW-TECH-012', name: 'Lokesh Gowda',       dept: dTech, desg: desgWaterBody, shift: shiftGen },
    // Housekeeping
    { code: 'EW-HKP-006', name: 'Meenakshi S',         dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-007', name: 'Nirmala Kumari',      dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-008', name: 'Padma Devi',          dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-009', name: 'Radha Krishnan',      dept: dHkp, desg: desgHkpJanitor, shift: shiftGen },
    { code: 'EW-HKP-010', name: 'Sumitra Singh',       dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-011', name: 'Tara Devi',           dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-012', name: 'Usha Rani',           dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-013', name: 'Vasantha Kumari',     dept: dHkp, desg: desgPantryLady, shift: shiftGen },
    { code: 'EW-HKP-014', name: 'Asha Latha',          dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-015', name: 'Bhagyalakshmi',       dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-016', name: 'Chitra Devi',         dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-017', name: 'Devaki Ammal',        dept: dHkp, desg: desgPantryLady, shift: shiftGen },
    { code: 'EW-HKP-018', name: 'Elakkiya S',          dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    { code: 'EW-HKP-019', name: 'Fatima Bibi',         dept: dHkp, desg: desgHkpStaff,   shift: shiftGen },
    // Waste Management
    { code: 'EW-WMST-004', name: 'Daljit Singh',       dept: dWaste, desg: desgWasteHndlr, shift: shiftMorn },
    { code: 'EW-WMST-005', name: 'Eshwar Lal',         dept: dWaste, desg: desgWasteHndlr, shift: shiftMorn },
    { code: 'EW-WMST-006', name: 'Faquir Chand',       dept: dWaste, desg: desgFieldStaff, shift: shiftMorn },
    // Horticulture
    { code: 'EW-HORT-003', name: 'Chinnaraj P',        dept: dHort, desg: desgGardener, shift: shiftMorn },
    { code: 'EW-HORT-004', name: 'Dhandapani M',       dept: dHort, desg: desgGardener, shift: shiftMorn },
    { code: 'EW-HORT-005', name: 'Elangovan K',        dept: dHort, desg: desgHort,     shift: shiftMorn },
    { code: 'EW-HORT-006', name: 'Ganesan T',          dept: dHort, desg: desgGardener, shift: shiftMorn },
    // Parking
    { code: 'EW-PARK-006', name: 'Farhan Sheikh',      dept: dPark, desg: desgParkMrshl, shift: shiftGen },
    { code: 'EW-PARK-007', name: 'Ganesh Pawar',       dept: dPark, desg: desgParkMrshl, shift: shiftGen },
    { code: 'EW-PARK-008', name: 'Hemant Kadam',       dept: dPark, desg: desgParkMrshl, shift: shiftNight },
    { code: 'EW-PARK-009', name: 'Imran Shaikh',       dept: dPark, desg: desgDriver,    shift: shiftGen },
    { code: 'EW-PARK-010', name: 'Jitendra More',      dept: dPark, desg: desgParkMrshl, shift: shiftMorn },
  ];

  inactive.forEach(e => addEmp(e.code, e.name, e.dept, e.desg, e.shift, 'Inactive'));

  // ── 8. Leave Requests ────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  const leaveEntries = [
    { name: 'Faisal Khan',      type: 'Casual Leave', reason: 'Personal work out of station', status: 'Approved' },
    { name: 'Hanumantha Reddy', type: 'Sick Leave',   reason: 'Fever — not feeling well',     status: 'Approved' },
    { name: 'Boopalan S',       type: 'Casual Leave', reason: 'Family function',               status: 'Approved' },
    { name: 'Rekha Patel',      type: 'Sick Leave',   reason: 'Medical appointment',           status: 'Pending'  },
  ];
  const insertLeave = db.prepare(`
    INSERT INTO leave_requests (employee_id, start_date, end_date, leave_type, reason, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  leaveEntries.forEach(({ name, type, reason, status }) => {
    const id = empIdMap[name];
    if (id) insertLeave.run(id, today, today, type, reason, status);
  });

  // ── 9. Punch Correction ──────────────────────────────────────────────────────
  const corrEmpId = empIdMap['Shankar H Y'];
  if (corrEmpId) {
    db.prepare(`
      INSERT INTO attendance_changes (employee_id, attendance_date, requested_check_in, requested_check_out, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(corrEmpId, '2026-06-22', '09:00', '18:00', 'Forgot to punch out due to shift overload', 'Pending');
  }

  // ── 10. Activity Logs ────────────────────────────────────────────────────────
  const insertLog = db.prepare('INSERT INTO activity_logs (text, type, user_id) VALUES (?, ?, ?)');
  insertLog.run('Attendix ERP initialized for Eco World facility.', 'System', 1);
  insertLog.run('Admin Rajesh Menon logged in to Eco World cluster.', 'Auth', 1);

  console.log(`Seeded 64 active + ${inactive.length} inactive employees across 8 departments.`);

  ensureTodayAttendance();
}

// ── Runs every server start — seeds today's attendance for ALL active employees ──
function ensureTodayAttendance() {
  const today = new Date().toISOString().split('T')[0];

  const existing = db.prepare('SELECT COUNT(*) as count FROM attendance WHERE attendance_date = ?').get(today);
  if (existing.count > 0) {
    console.log(`Attendance for ${today} already exists. Skipping.`);
    return;
  }

  // Fetch every active employee with their actual shift times
  const employees = db.prepare(`
    SELECT e.id, e.name, s.start_time, s.end_time
    FROM employees e
    LEFT JOIN shifts s ON e.shift_id = s.id
    WHERE e.status = 'Active'
    ORDER BY e.id
  `).all();

  if (employees.length === 0) {
    console.log('No active employees found — skipping attendance seed.');
    return;
  }

  const insertAtt = db.prepare(`
    INSERT OR IGNORE INTO attendance (employee_id, attendance_date, check_in, check_out, hours, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Deterministic check-in/out variance patterns (minutes offset from shift start/end)
  const inOffsets  = [-5, 2, -8, 3, 0, 7, -3, 10, -1, 5, 12, -6, 4, -2, 8, 1, -4, 6, 9, -7];
  const outOffsets = [5, 15, 0, 22, 8, 30, 3, 10, 18, 25, 2, 12, 35, 7, 20, 0, 15, 5, 28, 10];

  // Distribution pattern cycling over 20 slots: 14 Present · 3 Absent · 2 Leave · 1 WO  (~72% present)
  const statusPattern = [
    'Present','Present','Present','Present','Present','Present','Present',
    'Present','Present','Present','Present','Present','Present','Present',
    'Absent','Absent','Absent',
    'Leave','Leave',
    'Week Off'
  ];

  let presentCount = 0, absentCount = 0, leaveCount = 0, woCount = 0;

  employees.forEach((emp, idx) => {
    const slot = idx % statusPattern.length;
    const status = statusPattern[slot];

    if (status === 'Present') {
      const startStr = emp.start_time || '09:00';
      const endStr   = emp.end_time   || '18:00';
      const [sh, sm] = startStr.split(':').map(Number);
      const [eh, em] = endStr.split(':').map(Number);

      const inMin  = sh * 60 + sm + inOffsets[idx % inOffsets.length];
      const outMin = eh * 60 + em + outOffsets[idx % outOffsets.length];

      const pad = n => String(Math.floor(Math.abs(n))).padStart(2, '0');
      const checkIn  = `${pad(inMin / 60)}:${pad(inMin % 60)}`;
      const checkOut = `${pad(outMin / 60)}:${pad(outMin % 60)}`;

      let hours = (outMin - inMin) / 60;
      if (hours < 0) hours += 24; // overnight shift

      insertAtt.run(emp.id, today, checkIn, checkOut, parseFloat(hours.toFixed(2)), 'Present');
      presentCount++;
    } else {
      insertAtt.run(emp.id, today, null, null, 0, status);
      if (status === 'Absent')   absentCount++;
      else if (status === 'Leave')    leaveCount++;
      else if (status === 'Week Off') woCount++;
    }
  });

  console.log(`Attendance seeded for ${today}: ${presentCount} Present · ${absentCount} Absent · ${leaveCount} Leave · ${woCount} Week Off (total ${employees.length})`);
}
