import supertest from 'supertest';
import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from '../backend/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

export const request = supertest(app);
jest.mock('../backend/utils/sendEmail');

beforeAll(async () => {

    await connectTestDB();
    console.log(123)
});

describe('Database Connection', () => {
    it('should connect to MongoDB', async () => {
        const conStatus = mongoose.connection.readyState;
        expect(conStatus).toBe(1);
    });
});

afterAll(async () => {
    await disconnectTestDB();
});
