// TypeScript imports
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import config from './config';
import Database from './config/database';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import { requestLogger } from './middlewares/requestLogger';

// Import routes
import userRoutes from './routes/userRoutes';
import jobCardRoutes from './routes/jobCardRoutes';
import projectRoutes from './routes/projectRoutes';
import workDemandRequestRoutes from './routes/workDemandRequestRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import jobCardApplicationRoutes from './routes/jobCardApplicationRoutes';
import adminJobCardApplicationRoutes from './routes/admin/jobCardApplicationRoutes';
import chatbotRoutes from './routes/chatbotRoutes';

dotenv.config();

class App {
  public app: Application;
  private database: Database;

  constructor() {
    this.app = express();
    this.database = Database.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use(limiter);

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (config.server.nodeEnv !== 'test') {
      this.app.use(morgan('combined'));
    }
    this.app.use(requestLogger);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    // Health check route
    this.app.get('/health', (req: express.Request, res: express.Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.server.nodeEnv,
      });
    });

    // API routes
    this.app.use('/api/v1/users', userRoutes);
    this.app.use('/api/v1/job-cards', jobCardRoutes);
    this.app.use('/api/v1/projects', projectRoutes);
    this.app.use('/api/v1/work-requests', workDemandRequestRoutes);
    this.app.use('/api/v1/attendances', attendanceRoutes);
    this.app.use('/api/v1/payments', paymentRoutes);
    this.app.use('/api/v1/job-card-applications', jobCardApplicationRoutes);
    this.app.use('/api/v1/admin', adminJobCardApplicationRoutes);
    this.app.use('/api/v1/chatbot', chatbotRoutes);

    // Welcome route
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'Welcome to Capstone Backend API',
        version: '1.0.0',
        documentation: '/api/docs',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async connectToDatabase(): Promise<void> {
    const isConnected = await this.database.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
  }

  public async start(): Promise<void> {
    try {
      await this.connectToDatabase();
      
      const port = config.server.port;
      this.app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📡 Environment: ${config.server.nodeEnv}`);
        console.log(`🔗 Health check: http://localhost:${port}/health`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;