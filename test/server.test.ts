import supertest from 'supertest';
import mongoose from 'mongoose';
// import * as emailService from '../backend/utils/sendEmail';
import { app } from '@/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

export const request = supertest(app);

// export const emailService = jest.mock('../backend/utils/sendEmail', () => ({
//     sendEmail: jest.fn().mockResolvedValue(true),
//     // receiverEmailFunction: jest.fn().mockResolvedValue(true),
// }));

// jest.mock('../backend/utils/sendEmail', () => ({
//     sendEmail: jest.fn().mockResolvedValue(true),
// }));

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
