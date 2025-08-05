import mongoose from 'mongoose';

let isDbConnected = false;

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestateapp';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    console.log(process.env.MONGODB_URI)
    isDbConnected = true;
  } catch (error) {
    console.warn('MongoDB connection failed - running in demo mode without database:', error.message);
    isDbConnected = false;
    // Don't exit the process, allow the app to run without MongoDB
  }
};

export const isDatabaseConnected = () => isDbConnected;

export default connectDatabase;
