import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { isDatabaseConnected } from '../config/database';

export const signup = async (req: Request, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to use authentication features.'
    });
  }

  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
    });

    await user.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to use authentication features.'
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to use authentication features.'
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
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
