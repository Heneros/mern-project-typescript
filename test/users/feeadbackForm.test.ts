import request from 'supertest';
import * as emailService from '../../backend/utils/sendEmail';
import app from '@/server';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { sendEmail } from '../../backend/utils/sendEmail';
import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';

jest.mock('../../backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(true),
}));

describe('Feedback form ', () => {
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
        it('Should send feedback email', async () => {
            // await registerTestUser({ isEmailVerified: true });

            const obj = {
                name: 'Test',
                subject: 'Test',
                email: 'user@unique3.com',
                message: 'qwerty. dadad123',
            };
            const response = await request(app)
                .post('/api/v1/auth/feedback')
                .send(obj);

            expect(response.status).toBe(201);

            expect(response.body).toEqual({
                success: true,
                message: `Message was sent!`,
            });
            expect(sendEmail).toHaveBeenCalled();
        });
    });

    describe('Failure Scenarios', () => {
        it('should not send if empty field', async () => {
            const obj = {
                name: 'Test',
                subject: 'Test',
                email: '',
                message: 'qwerty. dadad123',
            };

            const res = await request(app)
                .post('/api/v1/auth/feedback')
                .send(obj);
            // console.log(res.body);

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: 'You must enter your email address',
            });
        });

        it('should not send email if many requests', async () => {
            const obj = {
                name: 'Test',
                subject: 'Test',
                email: 'user@unique3.com',
                message: 'qwerty. dadad123',
            };
            const feedbackReq = [];

            for (let i = 0; i < 12; i += 1) {
                feedbackReq.push(
                    request(app).post('/api/v1/auth/feedback').send(obj),
                );
            }
            await Promise.all(feedbackReq);

            const blockedRes = await request(app)
                .post('/api/v1/auth/feedback')
                .send(obj);

            expect(blockedRes.status).toBe(429);
            expect(blockedRes.body).toEqual({
                message: 'Too many requests from this IP address',
            });
        });
    });
});
