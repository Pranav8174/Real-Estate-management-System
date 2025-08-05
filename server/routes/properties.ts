import { Response } from 'express';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth';
import { isDatabaseConnected } from '../config/database';

export const getAllProperties = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to browse properties.'
    });
  }

  try {
    const properties = await Property.find({ status: 'available' })
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to view properties.'
    });
  }

  try {
    const property = await Property.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ property });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSellerProperties = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to manage properties.'
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const properties = await Property.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ properties });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to create properties.'
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyData = {
      ...req.body,
      seller: req.user._id,
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to update properties.'
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const property = await Property.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    Object.assign(property, req.body);
    await property.save();

    res.json({
      message: 'Property updated successfully',
      property,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to delete properties.'
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ...existing code...

export const addPropertyImages = async (req: AuthRequest, res: Response) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message: 'Database not available. Please set up MongoDB to add images.'
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const property = await Property.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    const { images } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    property.images = [...(property.images || []), ...images];
    await property.save();

    res.json({ message: 'Images added successfully', property });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
