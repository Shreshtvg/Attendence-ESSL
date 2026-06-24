import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'backend/database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Supervisor'))
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    fixed_week_off TEXT DEFAULT 'Sunday'
  );

  CREATE TABLE IF NOT EXISTS designations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    start_time TEXT NOT NULL, -- e.g. "09:00"
    end_time TEXT NOT NULL    -- e.g. "18:00"
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    department_id INTEGER,
    designation_id INTEGER,
    shift_id INTEGER,
    branch TEXT NOT NULL DEFAULT 'Main Branch',
    status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
    FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY(designation_id) REFERENCES designations(id) ON DELETE SET NULL,
    FOREIGN KEY(shift_id) REFERENCES shifts(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    attendance_date TEXT NOT NULL, -- YYYY-MM-DD
    check_in TEXT,                 -- HH:MM
    check_out TEXT,                -- HH:MM
    hours REAL DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Leave', 'Holiday', 'Week Off', 'Comp Off')),
    UNIQUE(employee_id, attendance_date),
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    approved_by INTEGER,
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY(approved_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS attendance_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    attendance_id INTEGER,
    attendance_date TEXT NOT NULL,
    requested_check_in TEXT,
    requested_check_out TEXT,
    requested_status TEXT DEFAULT 'Present',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    approved_by INTEGER,
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY(attendance_id) REFERENCES attendance(id) ON DELETE SET NULL,
    FOREIGN KEY(approved_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS rosters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    roster_date TEXT NOT NULL, -- YYYY-MM-DD
    shift_id INTEGER,
    UNIQUE(employee_id, roster_date),
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY(shift_id) REFERENCES shifts(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    holiday_date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    service_provided TEXT
  );

  CREATE TABLE IF NOT EXISTS roster_change_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    roster_date TEXT NOT NULL,
    requested_status TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    requested_by INTEGER,
    reviewed_by INTEGER,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY(requested_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY(reviewed_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    type TEXT NOT NULL, -- Info, Auth, System
    timestamp TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

// Migration: add requested_status column to existing databases
try {
  db.exec(`ALTER TABLE attendance_changes ADD COLUMN requested_status TEXT DEFAULT 'Present'`);
} catch (_) { /* column already exists */ }

console.log('SQLite database initialized successfully with foreign keys enabled.');

export default db;
