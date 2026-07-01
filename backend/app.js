require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');
const paymentRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');

let app;

async function getApp() {
  if (app) return app;

  await connectDB();

  app = express();

  const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      },
    })
  );

  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/tickets', ticketRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Event Management API is running' });
  });

  return app;
}

module.exports = { getApp };
