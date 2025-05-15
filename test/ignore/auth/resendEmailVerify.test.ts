import request from 'supertest';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import * as emailService from '../../../backend/utils/sendEmail';

import { app } from '@/server';
import { connectTestDB, disconnectTestDB } from '../../setupTestDB';
import { registerTestUser } from '../../helpers/registerTestUser';

import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Resend Token Verification to user ', () => {
    let obj: any;
    let user: IUser;
    let validRefreshToken: string;

    beforeAll(async () => {
        await connectTestDB();

        user = await registerTestUser({ isEmailVerified: true });

        obj = {
            userId: user.id,
            password: 'newpass123',
            passwordConfirm: 'newpass123',
        };

        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: user._id,
            token,
        });

        validRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET_KEY!,
            { expiresIn: '1d' },
        );

        await User.updateOne(
            { _id: user._id },
            { $set: { refreshToken: [validRefreshToken] } },
        );
    }, 30000);

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Should resend email ', async () => {
            const response = await request(app)
                .get('/api/v1/auth/new_access_token')
                .set('Cookie', [`jwtVilla=${validRefreshToken}`])
                .send();

            expect(response.status).toBe(200);

            expect(response.body).toMatchObject({
                success: true,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                provider: expect.any(String),
                avatar: expect.anything(),
                accessToken: expect.any(String),
            });
        });
    });

    describe('Failure Scenarios', () => {
        it(' returns 403 when refresh token has wrong user id', async () => {
            const badToken = jwt.sign(
                { id: new mongoose.Types.ObjectId() },
                process.env.JWT_REFRESH_SECRET_KEY!,
                { expiresIn: '1d' },
            );
            const res = await request(app)
                .get('/api/v1/auth/new_access_token')
                .set('Cookie', [`jwtVilla=${badToken}`]);

            expect(res.status).toBe(403);
        });

        it('returns 403 when token is not in DB (stolen or replay)', async () => {
            const stolen = jwt.sign(
                { id: user._id },
                process.env.JWT_REFRESH_SECRET_KEY!,
                { expiresIn: '1d' },
            );
            const res = await request(app)
                .get('/api/v1/auth/new_access_token')
                .set('Cookie', [`jwtVilla=${stolen}`]);

            expect(res.status).toBe(403);

            const freshUser = await User.findById({ _id: user._id }).lean();

            expect(freshUser?.refreshToken).toBeUndefined();
        });
    });
});
