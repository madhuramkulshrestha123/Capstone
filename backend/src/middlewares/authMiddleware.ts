import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UserModel } from '../models/UserModel';
import { User } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    name: string;
    email: string;
    role: 'supervisor' | 'admin';
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Access token required',
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = {
      user_id: decoded.user_id, // Changed from decoded.id to decoded.user_id
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || 'supervisor', // Default to supervisor if not in token
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Token expired',
        },
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Invalid token',
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Token verification failed',
      },
    });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = {
      user_id: decoded.user_id, // Changed from decoded.id to decoded.user_id
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || 'supervisor', // Default to supervisor if not in token
    };
    next();
  } catch (error) {
    // For optional auth, we don't send error response, just continue without user
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles: ('supervisor' | 'admin')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: `Access denied. Required role(s): ${roles.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
};

// Specific role middleware for convenience
export const requireSupervisor = requireRole(['supervisor']);
export const requireAdmin = requireRole(['admin']);
export const requireSupervisorOrAdmin = requireRole(['supervisor', 'admin']);