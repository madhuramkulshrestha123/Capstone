import express from 'express';
import { UserModel } from '../models/UserModel';
import { UserService } from '../services/UserService';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/v1/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const userModel = new UserModel();
    
    // Check if user already exists by email
    let existingUser = await userModel.findByEmail(profile.emails![0].value);
    
    if (existingUser) {
      // Return existing user
      return done(null, existingUser);
    }
    
    // Create a new user if they don't exist
    const userService = new UserService();
    const newUser = {
      role: 'admin' as const, // Using 'admin' as default role since 'worker' is not valid
      name: profile.displayName || (profile.name?.givenName + ' ' + profile.name?.familyName) || 'Google User',
      phone_number: '',
      aadhaar_number: '',
      email: profile.emails![0].value,
      panchayat_id: '',
      government_id: profile.id, // Use Google ID as government_id for Google accounts
      password: uuidv4(), // Generate temporary password for validation, won't be used for login
      state: '',
      district: '',
      village_name: '',
      pincode: '',
      image_url: profile.photos?.[0]?.value || null,
    };
    
    const createdUser = await userService.createRegistration(newUser);
    
    return done(null, createdUser);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to initialize passport
router.use(passport.initialize());

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req: express.Request & { user?: any }, res: express.Response) => {
    try {
      // Generate JWT token for the authenticated user
      const user: any = req.user;
      const token = jwt.sign(
        { userId: user.userId || user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '24h' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://capstone-bxz3.vercel.app' 
        : 'http://localhost:3000';
        
      res.redirect(`${frontendUrl}/auth?token=${token}`);
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
);

export default router;