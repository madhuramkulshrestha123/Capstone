// Seed database with sample data
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');
    
    // Create sample admin user
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        isActive: true
      }
    });
    
    console.log('Created admin user:', admin.username);
    
    // Create sample supervisor user
    const supervisorPassword = await bcrypt.hash('SupervisorPass123!', 10);
    const supervisor = await prisma.user.create({
      data: {
        username: 'supervisor',
        email: 'supervisor@example.com',
        passwordHash: supervisorPassword,
        firstName: 'Site',
        lastName: 'Supervisor',
        role: 'SUPERVISOR',
        isActive: true
      }
    });
    
    console.log('Created supervisor user:', supervisor.username);
    
    // Create sample worker user
    const workerPassword = await bcrypt.hash('WorkerPass123!', 10);
    const worker = await prisma.user.create({
      data: {
        username: 'worker',
        email: 'worker@example.com',
        passwordHash: workerPassword,
        firstName: 'Sample',
        lastName: 'Worker',
        role: 'WORKER',
        isActive: true
      }
    });
    
    console.log('Created worker user:', worker.username);
    
    // Create sample project
    const project = await prisma.project.create({
      data: {
        name: 'Sample Road Construction Project',
        description: 'Construction of rural roads in the sample district',
        location: 'Sample District, State',
        workerNeed: 50,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-31'),
        status: 'pending',
        createdBy: admin.id
      }
    });
    
    console.log('Created sample project:', project.name);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();