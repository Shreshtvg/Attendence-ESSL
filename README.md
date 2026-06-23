# Attendence ESSL — Attendance Management System

A full-stack attendance and workforce management system built with React, Express, and SQLite.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, TanStack Query |
| Backend  | Node.js, Express.js                     |
| Database | SQLite (better-sqlite3)                 |
| Auth     | JWT (15-minute idle session timeout)    |

---

## Run Locally

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone & Install

```bash
git clone <repo-url>
cd Attendence-ESSL
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
JWT_SECRET=your_secret_key_here
```

> The app runs without this — a fallback secret is used — but set it for any real deployment.

### 3. Start the Dev Server

```bash
npm run dev
```

This starts a single server on **http://localhost:3000** that serves both the Express API and the Vite-powered React frontend.

The SQLite database is created automatically at `backend/database.sqlite` on first run and seeded with sample data.

---

## Default Login Credentials

| Role       | Email                          | Password    |
|------------|--------------------------------|-------------|
| Admin      | rajesh.menon@ecoworld.in       | `Admin@123` |
| Supervisor | priya.nair@ecoworld.in         | `Sup@12345` |

---

## Available Scripts

| Command         | Description                                      |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Start development server (Express + Vite)        |
| `npm run build` | Build frontend for production                    |
| `npm start`     | Run production server (requires `npm run build`) |
| `npm run clean` | Delete build output and database                 |

---

## Project Structure

```
├── backend/
│   ├── server.js              # Express entry point
│   ├── database.sqlite        # Auto-generated SQLite database
│   └── src/
│       ├── config/            # JWT config
│       ├── controllers/       # Route handlers
│       ├── database/          # DB init & seed
│       ├── middlewares/       # Auth middleware
│       ├── repositories/      # DB queries
│       ├── routes/            # API routes
│       └── services/          # Business logic
├── frontend/
│   └── src/
│       ├── contexts/          # Auth context (idle timeout)
│       ├── layouts/           # Dashboard shell
│       ├── pages/             # Feature pages
│       ├── api/               # Axios client
│       └── components/        # Shared UI components
├── .env.local                 # Local environment variables (not committed)
├── package.json
└── vite.config.js
```
