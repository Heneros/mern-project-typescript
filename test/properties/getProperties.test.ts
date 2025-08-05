import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import  app  from '@/server';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';
import Property from '@/models/propertiesModel';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get all Property GET /api/v1/property', () => {
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
        await Property.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should Get all properties successfully', async () => {
            const testProperties = Array.from({ length: 12 }).map((_, i) => ({
                title: `Title Property ${i + 1}`,
                description: `Description ${i + 1}`,
                price: 100000 + i * 1000,
                address: `Address ${i + 1}`,
                preview: `Preview ${i + 1}`,
            }));

            await Property.insertMany(testProperties);

            const res = await request(app).get('/api/v1/property');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(12);
            expect(res.body.numberOfPages).toBeGreaterThan(1);
            expect(res.body.properties.length).toBeGreaterThanOrEqual(6);
        });

        it('should Get all properties from second page successfully', async () => {
            const testProperties = Array.from({ length: 12 }).map((_, i) => ({
                title: `Title Property ${i + 1}`,
                description: `Description ${i + 1}`,
                price: 100000 + i * 1000,
                address: `Address ${i + 1}`,
                preview: `Preview ${i + 1}`,
            }));

            await Property.insertMany(testProperties);

            const res = await request(app).get('/api/v1/property?page=2');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(12);
            expect(res.body.properties.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Failure Scenarios', () => {
        it('should Not Get all properties if page not', async () => {
            const testProperties = Array.from({ length: 12 }).map((_, i) => ({
                title: `Title Property ${i + 1}`,
                description: `Description ${i + 1}`,
                price: 100000 + i * 1000,
                address: `Address ${i + 1}`,
                preview: `Preview ${i + 1}`,
            }));

            await Property.insertMany(testProperties);

            const res = await request(app).get('/api/v1/property?page=12');
            // console.log(res.body);

            expect(res.body.properties.length).toBeLessThanOrEqual(0);
        });
    });
});
