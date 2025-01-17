import supertest from 'supertest';
import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from '../backend/server';
import connectDB from '../backend/config/connectDB';
import VerifyResetToken from '../backend/models/verifyResetTokenModel';

const request = supertest(app);
const MONGO_URI = String(process.env.MONGO_URI_LOCAL!);

beforeAll(async () => {
    // await connectDB(MONGO_URI);
    try {
        await connectDB(MONGO_URI);
        console.log(
            'MongoDB Connection State:',
            mongoose.connection.readyState,
        );
        console.log('MongoDB Connected to:', mongoose.connection.host);
    } catch (error) {
        console.error('Database connection error:', error);
    }
});

describe('Database Connection', () => {
    it('should connect to MongoDB', async () => {
        const conStatus = mongoose.connection.readyState;
        expect(conStatus).toBe(1);
    });
});

describe('CRUD operations User', () => {
    let userId: string;
    let token: string;

    test('It should user create', async () => {
        const userData = {
            username: 'admin',
            email: 'admin@gmail.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'testtest',
            passwordConfirm: 'testtest',
            roles: ['Admin', 'User', 'Editor'],
        };
        const response = await request
            .post('/api/v1/auth/register')
            .send(userData);

        console.log('userData userData:', userData);
        expect(response.status).toBe(201);
        userId = response.body.userId;
        console.log('Response body:', userId);
    });

    // test('It should create a verification token and verify email', async () => {
    //     const tokenDoc = await VerifyResetToken.create({
    //         _userId: userId,
    //         token: 'testemailtoken123',
    //     });
    //     token = tokenDoc.token;
    //     const verifyResponse = await request.get(
    //         `/api/v1/auth/verify/${token}/${userId}`,
    //     );
    //     expect(verifyResponse.status).toBe(302);
    //     expect(verifyResponse.headers.location).toBe('/auth/verify');
    // });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});
