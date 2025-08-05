import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  amenities: string[];
  seller: mongoose.Types.ObjectId;
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'land', 'commercial'],
    required: true,
  },
  bedrooms: {
    type: Number,
    min: 0,
  },
  bathrooms: {
    type: Number,
    min: 0,
  },
  area: {
    type: Number,
    required: true,
    min: 1,
  },
  images: [{
    type: String,
  }],
  amenities: [{
    type: String,
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available',
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Property = mongoose.model<IProperty>('Property', propertySchema);
