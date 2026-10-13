require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');

const connectDB = require('./config/db');
const initSocket = require('./sockets');
const { startSimulator } = require('./services/simulator');

const app = express();
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api', apiLimiter);

const ensureDatabaseConfig = async () => {
  if (process.env.MONGO_URI) return;

  const shouldUseMemoryDb = process.env.USE_MEMORY_DB !== 'false';
  if (shouldUseMemoryDb) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memoryMongo = await MongoMemoryServer.create();
      process.env.MONGO_URI = memoryMongo.getUri();
      console.log('⚠️ Using in-memory MongoDB fallback for local development.');
    } catch (error) {
      console.warn('⚠️ MongoDB fallback unavailable:', error.message);
    }
  }
};

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    dbConnected: Boolean(process.env.MONGO_URI)
  })
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/vitals', require('./routes/vitalRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/beds', require('./routes/bedRoutes'));
app.use('/api/handovers', require('./routes/handoverRoutes'));

// 404 + error handler (last)
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use(require('./middleware/errorHandler'));

const server = http.createServer(app);
initSocket(server);
const { runEscalationSweep } = require('./services/escalationService');
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await ensureDatabaseConfig();
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (process.env.SIMULATOR_ENABLED === 'true') {
      startSimulator();
      runEscalationSweep();
    }
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  server.listen(PORT);
});

module.exports = app;