import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import { app } from '@/server';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';
import Property from '@/models/propertiesModel';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Create Property /api/v1/property/create', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;

    const objData = {
        currentPassword: 'validPassword123!',
        password: 'newPassword',
        passwordConfirm: 'newPassword',
    };

    beforeAll(async () => {
        await connectTestDB();

        const res = await registerTestUser({ isEmailVerified: true });

        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: res._id,
            token,
        });

        userToken = jwt.sign(
            { id: res._id, roles: res.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: res._id },
            { $set: { refreshToken: [userToken] } },
        );
    }, 30000);

    beforeEach(async () => {
        // await User.deleteMany({});
        // await VerifyResetToken.deleteMany({});
        const res = await registerTestUser({ isEmailVerified: true });

        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: res._id,
            token,
        });

        userToken = jwt.sign(
            { id: res._id, roles: res.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: res._id },
            { $set: { refreshToken: [userToken] } },
        );
    });

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should create a property successfully', async () => {
            const response = await request(app)
                .post('/api/v1/property/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'Test Property',
                    price: 123456,
                    category: 'apartment',
                    description: 'Nice apartment',
                    bedrooms: 2,
                    bathrooms: 1,
                    area: 80,
                    floor: 2,
                    parking: true,
                    questionsAndAnswers: [],
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toMatch(/property created/i);

            const property = await Property.findOne({ title: 'Test Property' });
            expect(property).not.toBeNull();
        });
    });

    describe('Failure Scenarios', () => {
        it('should fail if property with title already exists', async () => {
            await Property.create({
                title: 'Duplicate Property',
                price: 100000,
                preview: 'qwerty123',
            });

            const response = await request(app)
                .post('/api/v1/property/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'Duplicate Property',
                    price: 100000,
                    preview: '123we',
                })
                .expect(400);

            expect(response.body.message).toMatch(/already created/i);
        });

        it('should fail if you not admin', async () => {
            const user = await registerNotAdmin({ isEmailVerified: true });

            userTokenWrong = jwt.sign(
                { id: user!._id, roles: user!.roles },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );

            const response = await request(app)
                .post('/api/v1/property/create')
                .set('Authorization', `Bearer ${userTokenWrong}`)
                .send({
                    title: 'Duplicate Property',
                    price: 100000,
                    preview: '123we',
                });

            // .expect(400);

            expect(response.body.message).toMatch(
                /You are not authorized to perform this request/i,
            );
            expect(response.body.success).toBe(false);
        });
        it('should fail if property with title already exists', async () => {
            const response = await request(app)
                .post('/api/v1/property/create')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'Duplicate Property',
                    preview: '123we',
                })
                .expect(400);
            // console.log(response.body);
            expect(response.body.message).toMatch(/no price/i);
        });
    });
});
