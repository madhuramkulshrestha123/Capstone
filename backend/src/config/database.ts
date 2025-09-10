import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private prisma: PrismaClient;
  private static instance: Database;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    // Handle process exit events for proper cleanup
    process.on('beforeExit', async () => {
      console.log('Process beforeExit event triggered');
    });

    process.on('exit', () => {
      console.log('Process exit event triggered');
    });

    // Handle signals for graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received');
      await this.prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received');
      await this.prisma.$disconnect();
      process.exit(0);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public get client(): PrismaClient {
    return this.prisma;
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.prisma.$disconnect();
    console.log('Database connection closed');
  }
}

export default Database;