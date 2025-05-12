import supertest from 'supertest';
import mongoose from 'mongoose';

import { app } from '@/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

export const request = supertest(app);

jest.mock('../backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

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
