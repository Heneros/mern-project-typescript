import supertest from 'supertest';
import VerifyResetToken from '../backend/models/verifyResetTokenModel';
import { app } from '../backend/server';
import { connectTestDB, disconnectTestDB } from './setupTestDB';

const request = supertest(app);

describe('Auth operations - All Scenarios', () => {
    let userId: string;
    let token: string;

    beforeAll(async () => {
        await connectTestDB();
    });

    /// Success Scenarios
    describe('Success Scenarios', () => {
        test('It should user create - Success Scenarios', async () => {
            const userData = {
                username: 'admin',
                email: 'admin@gmail.com',
                firstName: 'First',
                lastName: 'Last',
                password: 'testtest',
                passwordConfirm: 'testtest',
                roles: ['Admin', 'User', 'Editor'],
            };
            const response = await request
                .post('/api/v1/auth/register')
                .send(userData);

            // console.log('userData userData:', userData);
            expect(response.status).toBe(201);
            userId = response.body.userId;
            // console.log('Response body:', userId);
        });

        test('It should create a verification token and verify email', async () => {
            const tokenDoc = await VerifyResetToken.create({
                _userId: userId,
                token: 'testemailtoken123',
            });
            token = tokenDoc.token;
            const verifyResponse = await request.get(
                `/api/v1/auth/verify/${token}/${userId}`,
            );
            expect(verifyResponse.status).toBe(302);
            expect(verifyResponse.headers.location).toBe('/auth/verify');
        });
    });

    describe('Failures scenarios', () => {
        test('It should fail when registering with an existing email', async () => {
            const existingUserData = {
                username: 'admin',
                email: 'admin@gmail.com',
                firstName: 'First',
                lastName: 'Last',
                password: 'testtest',
                passwordConfirm: 'testtest',
            };

            await request.post('/api/v1/auth/register').send(existingUserData);

            const response = await request
                .post('/api/v1/auth/register')
                .send(existingUserData);
            // console.log(response.body);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain(
                "The email address you've entered is already associated with another account",
            );
        });

        test('It should fail when field(s) empty', async () => {
            const existingUserData = {
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                passwordConfirm: '',
            };

            await request.post('/api/v1/auth/register').send(existingUserData);

            const response = await request
                .post('/api/v1/auth/register')
                .send(existingUserData);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain(
                'All fields are required: email, username, firstName, lastName, password, and passwordConfirm',
            );
        });
    });
    afterAll(async () => {
        await disconnectTestDB();
    });
});
