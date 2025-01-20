import { request } from '../auth.test';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';

describe('Register all scenarios', () => {
    let userId: string;
    let token: string;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

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
});
