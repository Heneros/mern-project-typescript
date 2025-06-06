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

describe('Delete  Property DELETE /api/v1/property/:id', () => {
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
        it('should Delete property successfully', async () => {
            const propTest = await Property.create({
                title: 'Duplicate Property',
                price: 100000,
                preview: 'qwerty123',
            });

            const res = await request(app)
                .delete(`/api/v1/property/${propTest._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(200);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('message', 'Property was deleted!');
        });
    });

    describe('Failure Scenarios', () => {
        it('Return 404. Cant delete property if you not exist property', async () => {
            const res = await request(app)
                .delete(`/api/v1/property/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(404);

            // expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Not found property to delete/i);
        });
        it('Return 403. Cant delete property  if you not admin', async () => {
            const propTest = await Property.create({
                title: 'Duplicate Property',
                price: 100000,
                preview: 'qwerty123',
            });
            const responseS = await registerNotAdmin({ isEmailVerified: true });
            userTokenWrong = jwt.sign(
                { id: responseS!._id, roles: ['User'] },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );

            const res = await request(app)
                .delete(`/api/v1/property/${propTest._id}`)
                .set('Authorization', `Bearer ${userTokenWrong}`)
                .set('Content-Type', 'application/json')
                .expect(500);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(
                /You are not authorized to perform this request/i,
            );
        });
    });
});
