const { PrismaClient } = require('@prisma/client');

// Konfigurasi Prisma Client dengan log berdasarkan environment
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['warn', 'error']
});

// Test database connection
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Berikan solusi spesifik berdasarkan error
    if (error.code === 'P1001') {
      console.log('💡 Can\'t reach database server. Check if your database is running');
    } else if (error.code === 'P1002') {
      console.log('💡 Database connection timed out. Check your network connection');
    } else if (error.code === 'P1017') {
      console.log('💡 Database server closed the connection. Check max_connections setting');
    } else if (error.code === 'P1000') {
      console.log('💡 Authentication failed. Check database credentials in .env file');
    }
    
    return false;
  }
};

// Graceful shutdown
const shutdownPrisma = async () => {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected gracefully');
};

// PERBAIKAN: Export prisma instance langsung untuk backward compatibility
module.exports = prisma;

// Also export additional functions
module.exports.testConnection = testConnection;
module.exports.shutdownPrisma = shutdownPrisma;
module.exports.prisma = prisma;