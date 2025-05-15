import request from 'supertest';
import * as bcrypt from 'bcryptjs';

import * as emailService from '../../../backend/utils/sendEmail';

import { app } from '@/server';
import { connectTestDB, disconnectTestDB } from '../../setupTestDB';
import { registerTestUser } from '../../helpers/registerTestUser';

import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';
import { domainURL } from '@/constants';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Request reset Password ', () => {
    let obj: any;
    let user: IUser;

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
    }, 30000);

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Should request rest password ', async () => {
            const res = await request(app)
                .post('/api/v1/auth/reset_password_request')
                .send({ email: user.email });

            console.log(res.body);

            expect(res.status).toBe(200);
            expect(emailService.sendEmail).toHaveBeenCalled();
            expect(res.body).toEqual({
                success: true,
                message: `Hey ${user.firstName}, an email has been sent to your account with the password reset link`,
            });
        });
    });

    describe('Failure Scenarios', () => {
        it('should reject if email missing', async () => {
            const res = await request(app)
                .post('/api/v1/auth/reset_password_request')
                .send({});

            // expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                message: 'You must enter your email address',
            });
        });

        it(' should reject if user not found', async () => {
            const res = await request(app)
                .post('/api/v1/auth/reset_password_request')
                .send({ email: 'nonexistent@example.com' });

            console.log(res.body);
            // expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: 'That email is not associated with any account',
            });
        });
        it('Check if user exist in model ', async () => {
            const resetReq = [];
            for (let i = 0; i < 4; i += 1) {
                resetReq.push(
                    request(app)
                        .post('/api/v1/auth/reset_password_request')
                        .send({ email: user.email }),
                );
            }
            await Promise.all(resetReq);
            const blockedRes = await request(app)
                .post('/api/v1/auth/reset_password_request')
                .send({ email: user.email });

            // console.log(blockedRes.body);
            // expect(res.status).toBe(400);
            expect(blockedRes.status).toBe(429);
            expect(blockedRes.body).toEqual({
                message: 'Too many requests from this IP address',
            });
        });
    
    });
});
