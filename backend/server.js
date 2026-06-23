import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { runSeed } from './src/database/seed.js';
import apiRouter from './src/routes/api.js';

async function startServer() {
  // Priming the database with seeds
  try {
    runSeed();
  } catch (err) {
    console.error('Database seeding failed', err);
  }

  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes mount
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'OK', timestamp: new Date() });
  });

  // Integration of Vite middleware for local development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mounting Vite Web Development server...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Assets Build hosting
    console.log('Hosting production distribution...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Attendix ERP Server boot active at: http://localhost:${PORT}`);
  });
}

startServer();
