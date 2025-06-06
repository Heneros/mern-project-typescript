import request from 'supertest';
import * as emailService from '../../backend/utils/sendEmail';

import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { registerTestUser } from '../helpers/registerTestUser';
import { app } from '@/backend/server';
import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';

jest.mock('../../backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Resend Email Verification Token  ', () => {
    beforeAll(async () => {
        await connectTestDB();
    }, 30000);

    afterEach(async () => {
        await User.deleteMany({});
        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('Should send email', async () => {
            const user = await registerTestUser({ isEmailVerified: false });

            const response = await request(app)
                .post('/api/v1/auth/resend_email_token')
                .send({ email: user.email });
            // console.log(user);
            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: `${user.firstName}, an email has been sent to your account, please verify within 15 minutes`,
                success: true,
            });
            expect(emailService.sendEmail).toHaveBeenCalled();

            const tokens = await VerifyResetToken.find({ _userId: user._id });
            expect(tokens).toHaveLength(1);
        });
    });

    describe('Failure Scenarios', () => {
        it('should block resend if already verified', async () => {
            const user = await registerTestUser({ isEmailVerified: true });
            const res = await request(app)
                .post('/api/v1/auth/resend_email_token')
                .send({ email: user.email });

            expect(res.body).toEqual({
                message: 'This account has already been verified. Please login',
                success: false,
            });
        });
        it('should block resend if already verified', async () => {
            const user = await registerTestUser({ isEmailVerified: true });

            const res = await request(app)
                .post('/api/v1/auth/resend_email_token')
                .send({ email: user.email });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: 'This account has already been verified. Please login',
            });
        });
    });
});
