// server/config/validateEnv.js

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'FRONTEND_URL',
  'API_VERSION'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('💡 Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Validate PORT
  const port = Number(process.env.PORT);
  if (isNaN(port) || port <= 0) {
    console.error('❌ PORT must be a valid positive number');
    process.exit(1);
  }

  // Validate DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (
    !dbUrl.startsWith('mysql://') &&
    !dbUrl.startsWith('postgresql://')
  ) {
    console.error('❌ DATABASE_URL must start with mysql:// or postgresql://');
    process.exit(1);
  }

  // Optional: Validate JWT_SECRET length
  if (process.env.JWT_SECRET.length < 10) {
    console.warn('⚠️ JWT_SECRET is very short — consider using at least 32 characters for better security');
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;
