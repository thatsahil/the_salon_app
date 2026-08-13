const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const clientRoutes = require('./routes/client.routes');
const reportRoutes = require('./routes/report.routes');
const serviceRoutes = require('./routes/service.routes');

const app = express();

// Middlewares
const getCorsOrigins = () => {
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
  ];
  if (!process.env.CLIENT_URL) return '*';

  const cleanUrl = process.env.CLIENT_URL.trim().replace(/\/+$/, '');
  return [...defaultOrigins, cleanUrl, `${cleanUrl}/`];
};

const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/services', serviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
