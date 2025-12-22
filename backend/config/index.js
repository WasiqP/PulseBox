// Configuration file
// Loads environment variables and exports config

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    // MongoDB
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/raviro',
    
    // PostgreSQL (alternative)
    // pgHost: process.env.PG_HOST || 'localhost',
    // pgPort: process.env.PG_PORT || 5432,
    // pgDatabase: process.env.PG_DATABASE || 'raviro',
    // pgUser: process.env.PG_USER || 'postgres',
    // pgPassword: process.env.PG_PASSWORD || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  
  // Email (for password reset, notifications)
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
};

