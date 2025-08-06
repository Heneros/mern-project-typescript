import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import app from '@/server';

import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import Property from '@/models/propertiesModel';
import Order from '@/models/orderModel';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get all My Orders GET /api/v1/orders', () => {
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

        const property = await Property.create({
            title: 'Test Property',
            price: 100000,
            preview: 'image.jpg',
            address: '123 Street',
        });

        const productReq = [];

        for (let i = 0; i < 12; i += 1) {
            productReq.push(
                request(app)
                    .post('/api/v1/order')
                    .send({
                        user: res._id,
                        paypalOrderId: `paypal_123456-${Date.now()}-${i}`,
                        orderItems: [
                            {
                                title: 'Test Property',
                                preview: 'image.jpg',
                                price: 100000,
                                property: property._id,
                            },
                        ],
                        itemsPrice: 100000,
                        taxPrice: 0,
                        totalPrice: 100000,
                        paymentMethod: 'PayPal',
                        isPaid: true,
                        paidAt: new Date(),
                    })
                    .set('Authorization', `Bearer ${userToken}`),
            );
        }
        await Promise.all(productReq);
    });

    afterEach(async () => {
        await Order.deleteMany({});
        await User.deleteMany({});
        await Property.deleteMany({});

        await VerifyResetToken.deleteMany({});
    });

    afterAll(async () => {
        await disconnectTestDB();
    }, 30000);

    describe('Success Scenario', () => {
        it('should Get all orders successfully', async () => {
            const res = await request(app)
                .get('/api/v1/order')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            // console.log(res.body);
            expect(Array.isArray(res.body.orders)).toBe(true);
            expect(res.body.orders.length).toBeGreaterThan(6);
            expect(res.body.count).toBeGreaterThan(10);
            expect(res.body.numberOfPages).toBeGreaterThanOrEqual(1);
            expect(res.body.orders[0]).toHaveProperty('user');
        });

        it('should Get all orders from second page', async () => {
            const res = await request(app)
                .get('/api/v1/order?page=2')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.body.count).toBeGreaterThan(1);
        });
    });

    describe('Failure Scenarios', () => {
        it('should Not Get all orders if not  authorized', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });
            // const fakeId = '507f1f77bcf86cd799439011';

            userTokenWrong = jwt.sign(
                { id: responseS!._id, roles: ['User'] },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );

            const res = await request(app)
                .get('/api/v1/order/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer`)
                .expect(401);

            expect(res.body.message).toMatch(/Unauthorized/i);
        });
    });
});
