require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const candidateRoutes = require('./src/routes/candidateRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', candidateRoutes);
app.use('/api', messageRoutes);

app.get('/health', (req, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  openai: !!process.env.OPENAI_API_KEY,
}));

// Connect to MongoDB if URI provided, otherwise run without DB (auth disabled)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.warn('MongoDB connection failed:', err.message));
} else {
  console.warn('No MONGODB_URI set — auth endpoints will not work. Add it to .env to enable.');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI: ${process.env.OPENAI_API_KEY ? 'enabled' : 'using template fallback'}`);
});
