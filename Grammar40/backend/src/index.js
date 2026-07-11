require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const lessonRoutes = require('./routes/lesson');
const penaltyRoutes = require('./routes/penalty');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost') || origin.endsWith('.vercel.app') || origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected');
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Mongoose connection error:', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/penalty', penaltyRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;
