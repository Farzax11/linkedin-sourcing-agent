require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const candidateRoutes = require('../src/routes/candidateRoutes');
const messageRoutes = require('../src/routes/messageRoutes');
const authRoutes = require('../src/routes/authRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', candidateRoutes);
app.use('/api', messageRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  openai: !!process.env.OPENAI_API_KEY,
}));

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).catch((err) =>
    console.warn('MongoDB connection failed:', err.message)
  );
}

module.exports = app;
