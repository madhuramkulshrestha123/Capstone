import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from './index';

dotenv.config();

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    // Use DATABASE_URL if available (for Render deployment), otherwise use individual env vars
    if (config.database.url) {
      console.log('Using DATABASE_URL for connection');
      this.pool = new Pool({
        connectionString: config.database.url,
        ssl: {
          rejectUnauthorized: false
        }
      });
    } else {
      console.log('Using individual environment variables for connection');
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '12345678',
        database: process.env.DB_NAME || 'capstone_db',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

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
      await this.pool.end();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received');
      await this.pool.end();
      process.exit(0);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public get client(): Pool {
    return this.pool;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection test successful');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    console.log('Database connection closed');
  }
  
  public async query(text: string, params?: any[]): Promise<any> {
    try {
      const start = Date.now();
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      console.error('Error executing query', { text, error });
      throw error;
    }
  }
}

export default Database;