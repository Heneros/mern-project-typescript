import supertest from 'supertest';
import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from '../backend/server';
import connectDB from '../backend/config/connectDB';
import VerifyResetToken from '../backend/models/verifyResetTokenModel';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

beforeAll(async () => {
    await connectTestDB();
});

describe('Database Connection', () => {
    it('should connect to MongoDB', async () => {
        const conStatus = mongoose.connection.readyState;
        expect(conStatus).toBe(1);
    });
});

afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    // await mongoose.disconnect();
    await disconnectTestDB();
});
