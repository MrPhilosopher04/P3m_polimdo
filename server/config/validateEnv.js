//server/config/validateEnv.js
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
    console.log('💡 Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Validasi tambahan untuk nilai environment
  if (isNaN(Number(process.env.PORT))) {
    console.error('❌ PORT must be a number');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL.startsWith('mysql://') && 
      !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.error('❌ DATABASE_URL must start with mysql:// or postgresql://');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv;