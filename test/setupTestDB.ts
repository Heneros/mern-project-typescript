import mongoose from 'mongoose';
import connectDB from '@/config/connectDB';

export const connectTestDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await connectDB(process.env.MONGO_URI_TEST!);
            //   console.log('Connected to TEST database');
        }
    } catch (error) {
        console.error('Test DB connection error:', error);
        process.exit(1);
    }
};

export const disconnectTestDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.disconnect();
            // console.log('Disconnected from TEST database');
        }
    } catch (error) {
        console.error('Test DB disconnection error:', error);
        process.exit(1);
    }
};
