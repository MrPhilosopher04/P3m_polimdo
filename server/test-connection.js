const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test basic connection
    const users = await prisma.user.findMany();
    console.log('✅ Database connected successfully!');
    console.log(`Found ${users.length} users in database`);
    
    // Test relations
    const proposalsWithDetails = await prisma.proposal.findMany({
      include: {
        ketua: true,
        skema: true,
        members: {
          include: {
            user: true
          }
        }
      }
    });
    
    console.log(`Found ${proposalsWithDetails.length} proposals with details`);
    console.log('✅ Database relations working correctly!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();