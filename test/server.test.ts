import supertest from 'supertest';
import 'dotenv/config';
import mongoose, { ConnectionStates } from 'mongoose';
import { app, startServer } from '../backend/server';
import connectDB from '../backend/config/connectDB';
import createProperty from '../backend/controllers/properties/createProperty';

const request = supertest(app);
const MONGO_URI = process.env.MONGO_URI!;

beforeAll(async () => {
    await connectDB(MONGO_URI);
});

describe('Database Connection', () => {
    it('should connect to MongoDB', async () => {
        const conStatus = mongoose.connection.readyState;
        expect(conStatus).toBe(1);
    });
});

describe('CRUD operations Requests', () => {
    test('It should root posts POST method', async () => {
        const propertyData = {
            title: 'Test Property',
            preview: 'Sample preview',
            category: 'Apartment',
            price: 500000,
        };
        const response = await request
            .post('/api/v1/property/create')
            .send(propertyData);
            
        expect(response.status).toBe(201);
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});
