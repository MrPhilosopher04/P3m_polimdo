// server/config/database.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error']
});

const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);

    // Specific error tips
    switch (error.code) {
      case 'P1001':
        console.log('💡 Can\'t reach database server. Is it running?');
        break;
      case 'P1002':
        console.log('💡 Connection timed out. Check network or firewall.');
        break;
      case 'P1000':
        console.log('💡 Authentication failed. Check credentials.');
        break;
      case 'P1017':
        console.log('💡 Connection closed by server. Review max_connections.');
        break;
    }

    return false;
  }
};

const shutdownPrisma = async () => {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected gracefully');
};

// Export as object (cleaner and more consistent)
module.exports = {
  prisma,
  testConnection,
  shutdownPrisma,
};
