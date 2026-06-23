import bcryptjs from 'bcryptjs';
import db from './db.js';

export function runSeed() {
  const existingUser = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUser.count > 0) {
    console.log('Database already seeded. Skipping other seeds...');
    return;
  }

  console.log('Seeding Eco World enterprise data for Attendix ERP...');

  const adminPassword = bcryptjs.hashSync('Admin@123', 10);
  const supPassword   = bcryptjs.hashSync('Sup@12345', 10);

  // ── 1. Users ────────────────────────────────────────────────────────────────
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  insertUser.run('Rajesh Menon',      'rajesh.menon@ecoworld.in',      adminPassword, 'Admin');
  insertUser.run('Priya Nair',        'priya.nair@ecoworld.in',        supPassword,   'Supervisor');
  insertUser.run('Karthik Subramaniam','karthik.sub@ecoworld.in',      supPassword,   'Supervisor');

  // ── 2. Departments ──────────────────────────────────────────────────────────
  const insertDept = db.prepare('INSERT INTO departments (name, description, fixed_week_off) VALUES (?, ?, ?)');
  const dSec   = insertDept.run('Security',           'Security force and access control',          'Sunday').lastInsertRowid;
  const dProp  = insertDept.run('Property Management','Facility operations and property upkeep',     'Sunday').lastInsertRowid;
  const dStp   = insertDept.run('STP',                'Sewage Treatment Plant operations',           'Saturday').lastInsertRowid;
  const dTech  = insertDept.run('Technical',          'Electrical, plumbing & MEP engineering',     'Sunday').lastInsertRowid;
  const dHkp   = insertDept.run('Housekeeping',       'Premises hygiene and cleanliness',           'Sunday').lastInsertRowid;
  const dWaste = insertDept.run('Waste Management',   'Solid & liquid waste handling',              'Sunday').lastInsertRowid;
  const dHort  = insertDept.run('Horticulture',       'Landscape, greenery & garden maintenance',   'Sunday').lastInsertRowid;
  const dPark  = insertDept.run('Parking Management', 'Parking bays, valet & vehicle management',  'Sunday').lastInsertRowid;

  // ── 3. Designations ─────────────────────────────────────────────────────────
  const insertDesg = db.prepare('INSERT INTO designations (name, department_id) VALUES (?, ?)');
  const desgGuard     = insertDesg.run('Security Officer',    dSec).lastInsertRowid;
  const desgSuperv    = insertDesg.run('Security Supervisor', dSec).lastInsertRowid;
  const desgSecGuard  = insertDesg.run('Security Guard',      dSec).lastInsertRowid;
  const desgPropLead  = insertDesg.run('Facility Manager',    dProp).lastInsertRowid;
  const desgPropExec  = insertDesg.run('Facility Executive',  dProp).lastInsertRowid;
  const desgShiftEng  = insertDesg.run('Shift Engineer',     dProp).lastInsertRowid;
  const desgStp       = insertDesg.run('STP Operator',        dStp).lastInsertRowid;
  const desgElec      = insertDesg.run('Electrician',         dTech).lastInsertRowid;
  const desgTech      = insertDesg.run('Technician',          dTech).lastInsertRowid;
  const desgWaterBody = insertDesg.run('Water Body Operator', dTech).lastInsertRowid;
  const desgHkpLead   = insertDesg.run('Housekeeping Lead',   dHkp).lastInsertRowid;
  const desgHkp       = insertDesg.run('Housekeeping Staff',  dHkp).lastInsertRowid;
  const desgHkpJanitor = insertDesg.run('Sr. HK Janitor',     dHkp).lastInsertRowid;
  const desgPantryLady = insertDesg.run('Pantry Lady',        dHkp).lastInsertRowid;
  const desgWaste     = insertDesg.run('Waste Handler',       dWaste).lastInsertRowid;
  const desgFieldStaff = insertDesg.run('Field Staff',        dWaste).lastInsertRowid;
  const desgWasteSup  = insertDesg.run('Supervisor',          dWaste).lastInsertRowid;
  const desgHort      = insertDesg.run('Horticulturist',      dHort).lastInsertRowid;
  const desgGardener  = insertDesg.run('Gardener',            dHort).lastInsertRowid;
  const desgGardenSup = insertDesg.run('Garden Supervisor',   dHort).lastInsertRowid;
  const desgPark      = insertDesg.run('Parking Marshal',     dPark).lastInsertRowid;
  const desgDriver    = insertDesg.run('Driver',              dPark).lastInsertRowid;

  const desgMap = {
    'Security Officer': desgGuard,
    'Security Supervisor': desgSuperv,
    'Security Guard': desgSecGuard,
    'Facility Manager': desgPropLead,
    'Facility Executive': desgPropExec,
    'Shift Engineer': desgShiftEng,
    'STP Operator': desgStp,
    'Electrician': desgElec,
    'Technician': desgTech,
    'Water Body Operator': desgWaterBody,
    'Housekeeping Lead': desgHkpLead,
    'Housekeeping Staff': desgHkp,
    'Sr. HK Janitor': desgHkpJanitor,
    'Pantry Lady': desgPantryLady,
    'Waste Handler': desgWaste,
    'Field Staff': desgFieldStaff,
    'Supervisor': desgWasteSup,
    'Horticulturist': desgHort,
    'Gardener': desgGardener,
    'Garden Supervisor': desgGardenSup,
    'Parking Marshal': desgPark,
    'Driver': desgDriver
  };

  // ── 4. Shifts ───────────────────────────────────────────────────────────────
  const insertShift = db.prepare('INSERT INTO shifts (name, start_time, end_time) VALUES (?, ?, ?)');
  const shiftGen  = insertShift.run('General Shift', '09:00', '18:00').lastInsertRowid;
  const shiftMorn = insertShift.run('Morning Shift', '06:00', '14:00').lastInsertRowid;
  const shiftNight= insertShift.run('Night Shift',   '22:00', '06:00').lastInsertRowid;

  // ── 5. Holidays ─────────────────────────────────────────────────────────────
  const insertHoliday = db.prepare('INSERT INTO holidays (holiday_date, name, description) VALUES (?, ?, ?)');
  insertHoliday.run('2026-01-01', 'New Year Day',      'National rest day');
  insertHoliday.run('2026-01-26', 'Republic Day',      'National Republic Holiday');
  insertHoliday.run('2026-05-01', 'Labour Day',        'International Workers Day');
  insertHoliday.run('2026-08-15', 'Independence Day',  'National Independence Holiday');
  insertHoliday.run('2026-10-02', 'Gandhi Jayanti',    'National Holiday');
  insertHoliday.run('2026-11-14', 'Diwali',            'Festival of Lights');
  insertHoliday.run('2026-12-25', 'Christmas Day',     'Annual Christmas Holiday');

  // ── 6. Vendors ──────────────────────────────────────────────────────────────
  const insertVendor = db.prepare('INSERT INTO vendors (name, contact_person, email, phone, service_provided) VALUES (?, ?, ?, ?, ?)');
  insertVendor.run('JLL India Pvt Ltd',       'Aravind Rajan',     'aravind.rajan@jll.com',          '9880297101', 'Property Management');
  insertVendor.run('Amazing Blooms',          'Denita Fernandes',  'amazingbloomsrd@yahoo.in',        '9854517355', 'Horticulture');
  insertVendor.run('247 Facility Solutions',  'Mohan Pillai',      'mohan.pillai@247fspl.com',        '9741230045', 'Housekeeping');
  insertVendor.run('Saahas Waste Management', 'Swetha Krishnan',   'swetha@saahaszerowaste.org',      '9845001234', 'Waste Management');
  insertVendor.run('Voltas Limited',          'Suresh Iyer',       'suresh.iyer@voltas.com',          '9900112233', 'Technical / HVAC');
  insertVendor.run('G4S Security Services',   'Ramesh Nambiar',    'ramesh.nambiar@g4s.com',          '9811009988', 'Security Services');

  // ── 7. Employees ────────────────────────────────────────────────────────────
  const BRANCH = 'EcoWorld';

  const insertEmp = db.prepare(`
    INSERT INTO employees (employee_code, name, email, phone, department_id, designation_id, shift_id, branch, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seededEmployeeIds = [];
  let phoneBase = 9845100001;

  function addEmp(code, name, deptId, desgId, shiftId, status = 'Active') {
    const slug = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    const email = `${slug}@ecoworld.in`;
    const phone = String(phoneBase++);
    try {
      const res = insertEmp.run(code, name, email, phone, deptId, desgId, shiftId, BRANCH, status);
      seededEmployeeIds.push({ id: res.lastInsertRowid, deptId });
      return res.lastInsertRowid;
    } catch (e) {
      console.error(`Failed to add employee: name='${name}', email='${email}', code='${code}'`);
      throw e;
    }
  }

  // 1. Active Employees (9)
  const activeEmps = [
    { name: 'Shib Sankar', code: '25021', dept: dPark, desg: 'Driver', status: 'Active' },
    { name: 'Altaf Hussain', code: '48529', dept: dHkp, desg: null, status: 'Active' },
    { name: 'Rahamat Ali', code: '51691', dept: dHkp, desg: null, status: 'Active' },
    { name: 'Shankar H Y', code: '458261', dept: dProp, desg: 'Shift Engineer', status: 'Active' },
    { name: 'Naresh Kumar Jyothi', code: '563251', dept: dProp, desg: 'Security Officer', status: 'Active' },
    { name: 'Shambhunath', code: '54002', dept: dHkp, desg: null, status: 'Active' },
    { name: 'Santush Das', code: '53568', dept: dHkp, desg: null, status: 'Active' },
    { name: 'Dulal Uddin', code: '56206', dept: dHkp, desg: null, status: 'Active' },
    { name: 'Khandakar', code: '56690', dept: dHkp, desg: null, status: 'Active' }
  ];

  activeEmps.forEach(e => {
    addEmp(e.code, e.name, e.dept, e.desg ? desgMap[e.desg] : null, shiftGen, e.status);
  });

  // 2. Representative Inactive Employees (20)
  // (12 representative inactive + 8 STP department employees)
  const inactiveReps = [
    // Representative 12
    { name: 'Hiren Malo', code: '55558', dept: dSec, desg: 'Security Guard', shift: shiftGen },
    { name: 'Nandu', code: '42448', dept: dHkp, desg: 'Sr. HK Janitor', shift: shiftGen },
    { name: 'Babanna', code: '43911', dept: dHkp, desg: 'Sr. HK Janitor', shift: shiftGen },
    { name: 'Bharamappa', code: '42375', dept: dHkp, desg: 'Sr. HK Janitor', shift: shiftGen },
    { name: 'Tabita Nag', code: '45294', dept: dHkp, desg: 'Pantry Lady', shift: shiftGen },
    { name: 'Hanumantha', code: '3266', dept: dHort, desg: 'Gardener', shift: shiftMorn },
    { name: 'Puttaraj', code: '2519', dept: dHort, desg: 'Gardener', shift: shiftMorn },
    { name: 'Srinivas', code: '2905', dept: dHort, desg: 'Gardener', shift: shiftMorn },
    { name: 'Sushila', code: '2434', dept: dHort, desg: 'Garden Supervisor', shift: shiftMorn },
    { name: 'Mallikarjun', code: '920', dept: dWaste, desg: 'Field Staff', shift: shiftMorn },
    { name: 'Maneendra', code: '635', dept: dWaste, desg: 'Supervisor', shift: shiftMorn },
    { name: 'Aslam', code: '12165', dept: dTech, desg: 'Water Body Operator', shift: shiftGen },
    // STP 8
    { name: 'Joseph', code: '1512', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Ranganatha R', code: '1314', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Kammari Suresh', code: '1311', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Chandre Gowda', code: '1317', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Gajendra', code: '2212', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Shivaraja K', code: '2246', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Shivanna C', code: '2240', dept: dStp, desg: 'STP Operator', shift: shiftMorn },
    { name: 'Azmir Hussain', code: '2485', dept: dStp, desg: 'STP Operator', shift: shiftMorn }
  ];

  inactiveReps.forEach(e => {
    addEmp(e.code, e.name, e.dept, e.desg ? desgMap[e.desg] : null, e.shift, 'Inactive');
  });

  // Lists of additional realistic names for padding inactive employees up to 212
  const secNames = [
    'Suresh Babu', 'Vinod Kumar', 'Arjun Singh', 'Ravi Shankar', 'Prabhat Kumar',
    'Mohammed Arif', 'Bikram Thapa', 'Sunil Tamang', 'Deepak Rai', 'Mohan Gurung',
    'Raju Lama', 'Rajesh Paswan', 'Sanjay Kumar Singh', 'Amit Prasad', 'Dinesh Mandal',
    'Govind Mahato', 'Pramod Sharma', 'Satish Gupta', 'Ramesh Chandra', 'Bhola Nath',
    'Kanhaiya Lal', 'Manoj Tiwari', 'Ajay Verma', 'Vikas Yadav', 'Rakesh Mishra',
    'Pankaj Dubey', 'Suresh Pal', 'Dharmendra Kumar', 'Anil Chauhan', 'Ranjit Thakur',
    'Brijesh Maurya', 'Ratan Lal', 'Kamlesh Singh', 'Ashok Maurya', 'Devendra Sharma',
    'Girish Kumar', 'Harish Chandra', 'Jagdish Prasad', 'Kiran Kumar', 'Lalit Mohan',
    'Mahesh Gupta', 'Narendra Singh', 'Om Prakash', 'Pradeep Kumar', 'Qasim Ali',
    'Rajeev Ranjan', 'Sachin Tiwari', 'Tarun Kumar', 'Umesh Yadav', 'Vijay Kumar',
    'Wasim Aktar', 'Anwar Hussain', 'Babu Singh', 'Chandan Kumar', 'Dilip Singh',
    'Eshwar Reddy', 'Fateh Singh', 'Ganesh Kumar', 'Hemant Kumar'
  ];

  const propNames = [
    'Arun Menon', 'Bindhu Nair', 'Chandrika Pillai', 'Dileesh Kumar', 'Elsa Mathew',
    'Faisal Khan', 'Geetha Krishnan', 'Hari Prasad', 'Indira Suresh', 'Jayakumar M',
    'Kavitha Rajan', 'Lakshmi Devi', 'Murugan Subramanian', 'Nalini Ravindran', 'Oscar D Souza',
    'Pooja Iyer', 'Ranjith Nambiar', 'Saritha Babu', 'Thulasi Varma', 'Uma Shankar',
    'Varun Pillai', 'Wilma Fernandes', 'Xavier Paul', 'Yamini Krishnan'
  ];

  const techNames = [
    'Abdul Hameed', 'Babu Raj', 'Chandrashekar', 'Dinesh Mohan', 'Eswaran P',
    'Francis Joseph', 'Ganapathi R', 'Harish Naidu', 'Ibrahim Shaikh', 'Javed Akhtar',
    'Kiran Reddy', 'Lokesh Gowda', 'Mahendra Singh', 'Naga Sai', 'Om Prakash Verma',
    'Paramesh B', 'Rajkumar S', 'Satendra Kumar', 'Thiyagarajan', 'Uday Kumar',
    'Venkatesan R', 'Waseem Ahmed', 'Xavier D Cruz', 'Yellaiah K', 'Zubair Khan',
    'Arockiya Raj', 'Bennet Rodrigues', 'Cletus Pinto', 'Dhananjay Patil', 'Emmanuel Thomas',
    'Feroz Khan', 'George Abraham', 'Harshad Joshi'
  ];

  const hkpNames = [
    'Sushila Devi', 'Hanumantha Reddy', 'Puttaraju K', 'Srinivas Gowda',
    'Anjali Sharma', 'Rekha Patel', 'Lalitha Bai', 'Meenakshi S', 'Nirmala Kumari',
    'Padma Devi', 'Radha Krishnan', 'Sumitra Singh', 'Tara Devi', 'Usha Rani',
    'Vasantha Kumari', 'Asha Latha', 'Bhagyalakshmi', 'Chitra Devi', 'Devaki Ammal',
    'Elakkiya S', 'Fatima Bibi', 'Gomathi R', 'Hemavathi M', 'Indhumathi K',
    'Jayalakshmi N', 'Kamala Devi', 'Leelavathi P', 'Malathi G', 'Nagaratna B',
    'Omana Thomas', 'Parvathi M', 'Rajalakshmi S', 'Savithri Devi', 'Thilaga R',
    'Umadevi K', 'Vanajakshi S', 'Yamuna Devi', 'Zeenath Fathima'
  ];

  const wasteNames = [
    'Amarjeet Singh', 'Bhupinder Kumar', 'Charan Singh', 'Daljit Singh', 'Eshwar Lal', 'Faquir Chand'
  ];

  const hortNames = [
    'Annamalai R', 'Boopalan S', 'Chinnaraj P', 'Dhandapani M', 'Elangovan K',
    'Ganesan T', 'Illayaraja S', 'Jayaraman N', 'Kannaian P', 'Loganathan R'
  ];

  const parkNames = [
    'Aakash Pandey', 'Bhushan Patil', 'Chetan Sawant', 'Dhruv Kulkarni', 'Eknath Jadhav',
    'Farhan Sheikh', 'Ganesh Pawar', 'Hemant Kadam', 'Imran Shaikh', 'Jitendra More',
    'Kalpesh Desai', 'Laxman Shinde', 'Mahesh Waghmare', 'Nilesh Bhosale', 'Omkar Gaikwad',
    'Pratik Kharat', 'Rahul Mane', 'Sachin Dhole', 'Tejas Kale', 'Umesh Salunkhe',
    'Vishal Yadav', 'Waqar Khan'
  ];

  // Combine and loop to fill the rest of the 212 inactive slots
  let inactiveCount = inactiveReps.length;

  const extraDepts = [
    { list: secNames, dept: dSec, desg: desgGuard, shift: shiftGen, prefix: 'SEC' },
    { list: propNames, dept: dProp, desg: desgPropExec, shift: shiftGen, prefix: 'PROP' },
    { list: techNames, dept: dTech, desg: desgTech, shift: shiftGen, prefix: 'TECH' },
    { list: hkpNames, dept: dHkp, desg: desgHkp, shift: shiftGen, prefix: 'HKP' },
    { list: wasteNames, dept: dWaste, desg: desgWaste, shift: shiftMorn, prefix: 'WMST' },
    { list: hortNames, dept: dHort, desg: desgHort, shift: shiftMorn, prefix: 'HORT' },
    { list: parkNames, dept: dPark, desg: desgPark, shift: shiftGen, prefix: 'PARK' }
  ];

  let loopIdx = 0;
  while (inactiveCount < 212) {
    const deptInfo = extraDepts[loopIdx % extraDepts.length];
    const nameIdx = Math.floor(loopIdx / extraDepts.length);
    if (nameIdx < deptInfo.list.length) {
      const name = deptInfo.list[nameIdx];
      const code = `EW-${deptInfo.prefix}-${String(nameIdx + 20).padStart(3, '0')}`;
      addEmp(code, name, deptInfo.dept, deptInfo.desg, deptInfo.shift, 'Inactive');
      inactiveCount++;
    } else {
      const code = `EW-GEN-${String(inactiveCount).padStart(3, '0')}`;
      addEmp(code, `Staff Member ${inactiveCount}`, dHkp, desgHkp, shiftGen, 'Inactive');
      inactiveCount++;
    }
    loopIdx++;
  }

  // ── 8. Sample Leave Request ──────────────────────────────────────────────────
  if (seededEmployeeIds.length > 0) {
    const firstEmp = seededEmployeeIds[0];
    db.prepare(`
      INSERT INTO leave_requests (employee_id, start_date, end_date, leave_type, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(firstEmp.id, '2026-06-25', '2026-06-26', 'Casual Leave', 'Personal work out of station', 'Pending');
  }

  // ── 9. Sample Punch Correction ───────────────────────────────────────────────
  if (seededEmployeeIds.length > 70) {
    const emp = seededEmployeeIds[70];
    db.prepare(`
      INSERT INTO attendance_changes (employee_id, attendance_date, requested_check_in, requested_check_out, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(emp.id, '2026-06-22', '09:00', '18:00', 'Forgot to punch out due to shift overload', 'Pending');
  }

  // ── 10. Activity Logs ────────────────────────────────────────────────────────
  const insertLog = db.prepare('INSERT INTO activity_logs (text, type, user_id) VALUES (?, ?, ?)');
  insertLog.run('Attendix ERP initialized for Eco World facility.', 'System', 1);
  insertLog.run('Admin Rajesh Menon logged in to Eco World cluster.', 'Auth', 1);

  console.log(`Successfully seeded ${seededEmployeeIds.length} employees across 8 departments for Eco World.`);
}
