import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { isDatabaseConnected } from '../config/database';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to access protected routes.'
    });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role: 'buyer' | 'seller') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. ${role} role required.` });
    }

    next();
  };
};
