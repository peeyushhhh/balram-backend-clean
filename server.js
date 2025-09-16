console.log('🚀 Starting Balram Complex CMS Server...');

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('✅ Basic modules loaded');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/balramproperties');
const shopsRoutes = require('./routes/shops');
const telemetryRoutes = require('./routes/telemetry');

console.log('✅ Routes loaded');

// Create Express app
const app = express();

// Connect to database
console.log('📡 Connecting to MongoDB...');
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://balram-complex-frontend.vercel.app',  // Your Vercel dashboard
        'https://balramcomplex.com',                   // Your live website
        'http://127.0.0.1:5500',                      // VS Code Live Server
        'http://localhost:5500'                       // Alternative
      ]
    : [
        'http://localhost:5173',    // React dashboard
        'http://127.0.0.1:5500',    // VS Code Live Server
        'http://localhost:5500',    // Alternative port
        'http://localhost:3000'     // Just in case
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Middleware configured');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Balram Complex CMS API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server working perfectly!',
    data: {
      project: 'Balram Complex CMS',
      status: 'Development',
      database: 'Connected'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/telemetry', telemetryRoutes);

console.log('✅ Routes mounted');

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Express Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health', 
      '/api/test', 
      '/api/auth', 
      '/api/properties', 
      '/api/shops', 
      '/api/telemetry'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
// Force rebuild for Railway - Sept 15


console.log(`⏳ Starting server on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🏪 Shops: http://localhost:${PORT}/api/shops`);
  console.log(`🏠 Properties: http://localhost:${PORT}/api/properties`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`📈 Telemetry: http://localhost:${PORT}/api/telemetry`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.log('🔄 Shutting down server due to unhandled rejection...');
  server.close(() => process.exit(1));
});

console.log('📝 Server setup complete, waiting for connections...');
