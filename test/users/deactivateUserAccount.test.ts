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

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Deactivate user account', () => {
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
        it('Update password', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });

            const res = await request(app)
                .patch(`/api/v1/user/${responseS?._id}/deactivate`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .send();

            expect(res.status).toBe(200);
            expect(res.body.active).toBe(false);
            const updatedUser = await User.findById(responseS?._id);
            expect(updatedUser!.active).toBe(false);
        });
    });

    describe('Failure Scenarios', () => {
        it('should return 404 if user not found', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .patch(`/api/v1/user/${fakeId}/deactivate`)
                .set('Authorization', `Bearer ${userToken}`)
                .set('Content-Type', 'application/json')
                .expect(404);

            // expect(res.body.success).toBe(false);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/user was not found/i);
        });
    });
});
