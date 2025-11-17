import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  sendgrid: {
    apiKey: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    verifyServiceSid: string;
    phoneNumber: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'neondb_owner'}:${process.env.DB_PASSWORD || 'npg_TUy0sgCA5lKH'}@${process.env.DB_HOST || 'ep-withered-block-a1h91z9p-pooler.ap-southeast-1.aws.neon.tech'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'neondb'}?sslmode=require&channel_binding=require`,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_here',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
};

export default config;