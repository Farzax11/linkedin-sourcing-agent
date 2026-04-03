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

// Cache connection across serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// Connect before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api', authRoutes);
app.use('/api', candidateRoutes);
app.use('/api', messageRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  openai: !!process.env.OPENAI_API_KEY,
  mongoUri: process.env.MONGODB_URI ? 'set' : 'missing',
}));

module.exports = app;
