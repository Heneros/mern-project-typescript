import supertest from 'supertest';
import VerifyResetToken from '../backend/models/verifyResetTokenModel';
import { app } from '../backend/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';
import User from '../backend/models/userModel';
import { sendEmail } from '../backend/utils/sendEmail';

export const request = supertest(app);

jest.mock('../backend/utils/sendEmail');

// describe('Auth operations - All Scenarios', () => {
//     let userId: string;
//     let token: string;

//     beforeAll(async () => {
//         await connectTestDB();
//     });

//     /// Success Scenarios
//     describe('Success Scenarios', () => {
//         // test('Resend email verification token', async () => {
//         //     const dataEmail = {
//         //         email: 'admin@gmail.com',
//         //     };
//         //     const user = await User.findOne({
//         //         email: dataEmail.email,
//         //     });
//         //     if (!user) {
//         //         throw new Error('User not found');
//         //     }
//         //     if (user.isEmailVerified) {
//         //         throw new Error(
//         //             'This account has already been verified. Please login',
//         //         );
//         //     }
//         //     const response = await request
//         //         .post('/api/v1/auth/resend_email_token')
//         //         .send({ email: user.email });
//         //     expect(response.status).toBe(200);
//         //     expect(sendEmail).toHaveBeenCalledWith(
//         //         user.email,
//         //         'Account Verification',
//         //         expect.any(Object),
//         //         './emails/template/accountVerification.handlebars',
//         //     );
//         //     expect(response.body).toEqual({
//         //         success: true,
//         //         message: expect.stringContaining(
//         //             `${user.firstName}, an email has been sent to your account, please verify within 15 minutes`,
//         //         ),
//         //     });
//         // });
//         // test('new access token.', async () => {});
//         // test('It should create a verification token and verify email', async () => {
//         //     const tokenDoc = await VerifyResetToken.create({
//         //         _userId: userId,
//         //         token: 'testemailtoken123',
//         //     });
//         //     token = tokenDoc.token;
//         //     const verifyResponse = await request.get(
//         //         `/api/v1/auth/verify/${token}/${userId}`,
//         //     );
//         //     expect(verifyResponse.status).toBe(302);
//         //     expect(verifyResponse.headers.location).toBe('/auth/verify');
//         // });
//     });

//     afterAll(async () => {
//         await disconnectTestDB();
//     });
// });
