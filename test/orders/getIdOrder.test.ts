import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import * as emailService from '@/backend/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import { app } from '@/backend/server';

import User from '@/backend/models/userModel';
import VerifyResetToken from '@/backend/models/verifyResetTokenModel';
import Property from '@/backend/models/propertiesModel';
import Order from '@/backend/models/orderModel';
import { IOrder } from '@/backend/types/IOrderItem';

jest.mock('@/backend/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Get all My Orders GET /api/v1/orders', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;
    let order: IOrder;

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

        order = await Order.create({
            user: res._id,
            paypalOrderId: `paypal_123456-${Date.now()}`,
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
        });
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
        it('should Get Id order successfully', async () => {
            const res = await request(app)
                .get(`/api/v1/order/${order._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body.order).toBeDefined();
            expect(res.body.order._id).toBe(order!._id?.toString());
        });
    });

    describe('Failure Scenarios', () => {
        it('should Not Get all orders if not proper user', async () => {
            const responseS = await registerNotAdmin({ isEmailVerified: true });
            // const fakeId = '507f1f77bcf86cd799439011';

            userTokenWrong = jwt.sign(
                { id: responseS!._id, roles: ['User'] },
                process.env.JWT_ACCESS_SECRET_KEY!,
                { expiresIn: '1d' },
            );

            const res = await request(app)
                .get(`/api/v1/order/${order._id}`)
                .set('Authorization', `Bearer ${userTokenWrong}`)
                .expect(403);

            expect(res.body.message).toMatch(/Access denied to this order/i);
        });

        it('should Not Get order if order not exist', async () => {
            const res = await request(app)
                .get(`/api/v1/order/507f1f77bcf86cd799439011`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(404);

            // console.log(res.body);
            expect(res.body.message).toMatch(/Order not found/i);
        });
    });
});
