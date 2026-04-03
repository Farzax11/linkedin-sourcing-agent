require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./api/index');

const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.warn('MongoDB connection failed:', err.message));
} else {
  console.warn('No MONGODB_URI — auth endpoints disabled');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI: ${process.env.OPENAI_API_KEY ? 'enabled' : 'template fallback'}`);
});
