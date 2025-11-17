import App from './app';
import { setupDatabase } from './setup-database';

const app = new App();

// Setup database before starting the server in production
async function startServer() {
  try {
    // In production environment, setup database first
    if (process.env.NODE_ENV === 'production') {
      console.log('Setting up database in production environment...');
      try {
        const success = await setupDatabase();
        if (success) {
          console.log('Database setup completed successfully');
        } else {
          console.error('Database setup failed, continuing with server start...');
        }
      } catch (error) {
        console.error('Database setup error:', error);
        // Don't exit, continue with server start
      }
    }
    
    // Start the server
    await app.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process for uncaught exceptions, log and continue
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process for unhandled rejections, log and continue
});

// Start the server
startServer();