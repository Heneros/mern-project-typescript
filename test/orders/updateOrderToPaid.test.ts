import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import * as emailService from '@/utils/sendEmail';
import { connectTestDB, disconnectTestDB } from '../setupTestDB';
import {
    registerNotAdmin,
    registerTestUser,
} from '../helpers/registerTestUser';
import  app  from '@/server';

import User from '@/models/userModel';
import VerifyResetToken from '@/models/verifyResetTokenModel';
import Property from '@/models/propertiesModel';
import Order from '@/models/orderModel';
import { IOrder } from '@/types/IOrderItem';
import { IUser } from '@/types/IUser';

jest.mock('@/utils/sendEmail', () => ({
    sendEmail: jest.fn().mockResolvedValue(() => Promise.resolve(true)),
}));

describe('Create My Order POST /api/v1/orders', () => {
    let userToken: string;
    let userTokenWrong: string;

    let adminData;
    let order: IOrder;
    let resUser: IUser;
    let property: any;

    const objData = {
        currentPassword: 'validPassword123!',
        password: 'newPassword',
        passwordConfirm: 'newPassword',
    };

    beforeAll(async () => {
        await connectTestDB();

        resUser = await registerTestUser({ isEmailVerified: true });

        // userToken = res;
        const token = 'abc123';
        await VerifyResetToken.create({
            _userId: resUser._id,
            token,
        });

        userToken = jwt.sign(
            { id: resUser._id, roles: resUser.roles },
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '31d' },
        );

        await User.updateOne(
            { _id: resUser._id },
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

        property = await Property.create({
            title: 'Test Property',
            price: 100000,
            preview: 'image.jpg',
            address: '123 Street',
        });

        order = await Order.create({
            user: resUser._id,
            paypalOrderId: 'PAYPAL12345456',
            orderItems: [
                {
                    title: 'Test Property1',
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
        it('should Create order successfully', async () => {
            const res = await request(app)
                .put(`/api/v1/order/${order._id}/pay`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    id: 'PAYID123',
                    status: 'COMPLETED',
                    update_time: '2024-01-01T00:00:00Z',
                    payer: {
                        email_address: 'payer@example.com',
                    },
                });
            // .expect(201);

            expect(res.status).toBe(200);
            expect(res.body.isPaid).toBe(true);
            expect(res.body.paymentResult).toMatchObject({
                id: 'PAYID123',
                status: 'COMPLETED',
                update_time: '2024-01-01T00:00:00Z',
                email_address: 'payer@example.com',
            });
            // expect(res.body.orderItems._id).toBe(order._id?.toString());
        });
    });

    describe('Failure Scenarios', () => {
        it('should return 404 for non-existent order', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`/api/v1/order/${fakeId}/pay`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    id: 'PAYID123',
                    status: 'COMPLETED',
                    update_time: '2024-01-01T00:00:00Z',
                    payer: {
                        email_address: 'payer@example.com',
                    },
                });
            // .expect(404);

            // expect(res.status).toBe(404);
            expect(res.body).toMatchObject({
                message: 'Error updating order',
                error: 'Order not found',
            });
        });

        it('should return 500 for invalid order ID format', async () => {
            const res = await request(app)
                .put(`/api/v1/order/invalid-id/pay`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    id: 'PAYID123',
                    status: 'COMPLETED',
                    update_time: '2024-01-01T00:00:00Z',
                    payer: {
                        email_address: 'payer@example.com',
                    },
                });

            console.log(res.body);
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error updating order');
        });

        it('should reject request if unauthorized', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app)
                .put(`/api/v1/order/${order._id}/pay`)
                .send({
                    id: 'PAYID123',
                    status: 'COMPLETED',
                    update_time: '2024-01-01T00:00:00Z',
                    payer: {
                        email_address: 'payer@example.com',
                    },
                });

            expect(res.status).toBe(401);
        });
    });
});
