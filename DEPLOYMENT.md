# Deployment Instructions

This document provides step-by-step instructions for deploying your application to production with the backend on Render and frontend on Vercel, using Neon as your PostgreSQL database.

## Prerequisites

1. GitHub account
2. Render account (for backend deployment)
3. Vercel account (for frontend deployment)
4. Neon PostgreSQL database (already set up as per your instructions)

## Backend Deployment (Render)

### 1. Prepare Your Code
Make sure all your code is committed and pushed to your GitHub repository.

### 2. Set Up on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `capstone-backend`
   - Environment: `Node`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Plan: Select appropriate plan (Free tier available)

### 3. Configure Environment Variables
In the Render dashboard, add the following environment variables:
```
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_TUy0sgCA5lKH@ep-withered-block-a1h91z9p-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

Note: Replace the DATABASE_URL with your actual Neon connection string if different.

### 4. Initialize Database
Run the database setup script to create tables:
```bash
cd backend
npm run db:setup:neon
```

### 5. Deploy
Click "Create Web Service" and Render will automatically deploy your application.

## Frontend Deployment (Vercel)

### 1. Prepare Your Code
Make sure all your code is committed and pushed to your GitHub repository.

### 2. Set Up on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Environment Variables
In the Vercel dashboard, add the following environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
```

### 4. Deploy
Click "Deploy" and Vercel will automatically deploy your application.

## Database Management

Your Neon PostgreSQL database is already set up. To manage it:

1. Access the Neon dashboard at https://console.neon.tech/
2. Use the connection string: `postgresql://neondb_owner:npg_TUy0sgCA5lKH@ep-withered-block-a1h91z9p-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

## Post-Deployment Steps

1. Test the API endpoints using the Render URL
2. Verify frontend functionality using the Vercel URL
3. Check database connectivity and data persistence
4. Monitor logs on both Render and Vercel for any issues

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS_ORIGIN in Render matches your Vercel frontend URL
2. **Database Connection**: Verify DATABASE_URL is correctly set in Render environment variables
3. **API Not Accessible**: Check that your backend is running and the API_URL in Vercel is correct

### Useful Commands

```bash
# Test database connection locally
npm run db:check

# Run database setup
npm run db:setup:neon

# Build backend
npm run build

# Start backend locally
npm start
```

## Scaling Considerations

1. Monitor your Render service usage and upgrade if needed
2. For high-traffic applications, consider upgrading from Neon's free tier
3. Set up monitoring and alerting for both frontend and backend services