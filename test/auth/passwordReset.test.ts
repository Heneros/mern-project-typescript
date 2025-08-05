import request from 'supertest';
import * as bcrypt from 'bcryptjs';

import * as emailService from '../../backend/utils/sendEmail';

import  app  from '@/server';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { registerTestUser } from '../helpers/registerTestUser';

import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import { IUser } from '@/types/IUser';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Reset Password ', () => {
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
        it('Should reset password ', async () => {
            const response = await request(app)
                .post('/api/v1/auth/reset_password')
                .send(obj);

            const t = await VerifyResetToken.findOne({
                userId: user._id,
            });
            expect(t).toBeNull();
            const updated = await User.findById(user._id).select('+password');
            const match = await bcrypt.compare(
                obj.password,
                updated!.password as any,
            );

            // console.log(t);
            expect(match).toBe(true);
            expect(response.status).toBe(200);
            expect(emailService.sendEmail).toHaveBeenCalled();
            expect(response.body).toEqual({
                success: true,
                message: `Hey ${user.firstName},Your password reset was successful. An email has been sent to confirm the same`,
            });
        });
    });

    describe('Failure Scenarios', () => {
        it('Password dont match', async () => {
            const res = await request(app)
                .post('/api/v1/auth/reset_password')
                .send({
                    password: '123Wrong1',
                    passwordConfirm: '123Wrong',
                    userId: user._id,
                });

            // expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message: 'Passwords do not match',
            });
        });
        it('Check if user exist in model ', async () => {
            const res = await request(app)
                .post('/api/v1/auth/reset_password')
                .send({
                    password: '123Wrong331',
                    passwordConfirm: '123Wrong331',
                    userId: 'wrong',
                });
            console.log(res.body);
            // expect(res.status).toBe(400);
            expect(res.body).toMatchObject({
                success: false,
                message:
                    'Your token is either invalid or expired. Try resetting your password again',
            });
        });
        // it('If user wrong password enter', async () => {
        //     const obj = {
        //         name: 'Test',
        //         subject: 'Test',
        //         email: 'user@unique3.com',
        //         message: 'qwerty. dadad123',
        //     };
        //     const feedbackReq = [];

        //     for (let i = 0; i < 4; i += 1) {
        //         feedbackReq.push(
        //             request(app).post('/api/v1/auth/reset_password').send(obj),
        //         );
        //     }
        //     await Promise.all(feedbackReq);

        //     const blockedRes = await request(app)
        //         .post('/api/v1/auth/feedback')
        //         .send(obj);

        //     expect(blockedRes.status).toBe(429);
        //     expect(blockedRes.body).toEqual({
        //         message: 'Too many requests from this IP address',
        //     });
        // });
    });
});
