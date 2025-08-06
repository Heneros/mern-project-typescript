// config/connectTestDB.ts
import mongoose from 'mongoose';

let testConnection: typeof mongoose | null = null;

export const connectTestDB = async () => {
    try {
        if (testConnection && mongoose.connection.readyState === 1) {
            console.log('Using existing test database connection');
            return testConnection;
        }

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        const mongoUri = 'mongodb://127.0.0.1:27017/mernVillaTest';

        const options = {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 0,
            bufferCommands: false,

            retryWrites: false,
            maxPoolSize: 10,
            minPoolSize: 1,
        };

        testConnection = await mongoose.connect(mongoUri, options);

        console.log('Test database connected successfully');
        return testConnection;
    } catch (error) {
        console.error(' Test DB connection error:', error);
        testConnection = null;
        throw error;
    }
};

export const disconnectTestDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            // Drop the test database to clean up
            await mongoose.connection.dropDatabase();
            await mongoose.disconnect();
            testConnection = null;
            console.log('✅ Disconnected from test database and cleaned up');
        }
    } catch (error) {
        console.error('❌ Test DB disconnection error:', error);
        testConnection = null;
        // Don't exit process in tests - just log the error
        throw error;
    }
};

export const clearTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
};

// Helper to ensure clean state before each test
export const setupTestDB = async () => {
    await connectTestDB();
    await clearTestDB();
};

export const isTestDBConnected = (): boolean => {
    return mongoose.connection.readyState === 1;
};
