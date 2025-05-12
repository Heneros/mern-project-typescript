import mongoose from 'mongoose';
import connectDB from '../backend/config/connectDB';

const MONGO_URI = String(process.env.MONGO_URI_TEST!);

export const connectTestDB = async () => {
    try {
        await connectDB(MONGO_URI);
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export const disconnectTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
};
