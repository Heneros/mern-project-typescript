import supertest from 'supertest';
import mongoose from 'mongoose';
// import * as emailService from '../backend/utils/sendEmail';
import { app } from '@/backend/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

export const request = supertest(app);

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

describe('Database Connection', () => {
    it('should have active MongoDB connection', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });
});
