import { request } from '../server.test';
import verifyResetTokenModel from '../../backend/models/verifyResetTokenModel';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import { registerTestUser } from '../helpers/registerTestUser';

describe('Resend Email Verification Token  ', () => {
    beforeAll(async () => {
        await connectTestDB();
    }, 30000);

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should register new user with 201 status', async () => {
            const user = await registerTestUser();

            const response = await request
                .post('/api/v1/auth/resend_email_token')
                .send({ email: user.email });
            console.log(response.body);
            expect(response.status).toBe(200);

            // expect(response.status).toBe(201);
            // expect(response.body).toMatchObject({
            //     success: true,
            //     userId: expect.any(String),
            // });
        });
    });

    // describe('Failure Scenarios', () => {
    //     it('should block duplicate email registration', async () => {
    //         const duplicateUser = {
    //             username: 'duplicate',
    //             email: 'test@example.com',
    //             firstName: 'Duplicate',
    //             lastName: 'User',
    //             password: 'Password123!',
    //             passwordConfirm: 'Password123!',
    //         };

    //         const response = await request
    //             .post('/api/v1/auth/register')
    //             .send(duplicateUser);

    //         expect(response.status).toBe(400);
    //         expect(response.body.message).toMatch(/already associated/i);
    //     });

    //     it('should validate required fields', async () => {
    //         const response = await request
    //             .post('/api/v1/auth/register')
    //             .send({});

    //         expect(response.status).toBe(400);
    //         expect(response.body.message).toMatch(/required fields/i);
    //     });
    // });
});
