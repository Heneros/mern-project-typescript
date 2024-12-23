import { Request, Response } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const getOrderById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        // const { id } = req.params;
        const userReq = req as RequestWithUser;

        if (!userReq.user) {
            res.status(404).json({ message: 'User not authenticated' });
        }

        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'username email')
                .exec();

            if (!order) {
                res.status(404).json({ message: 'Order not found' });
            }
            const userId = userReq.user._id.toString();
            const orderUserId = order?.user._id.toString();

            if (orderUserId !== userId) {
                res.status(403).json({
                    message: 'Access denied to this order',
                });
                return;
            }

            res.status(200).json({ order });
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                res.status(400).json({
                    message: 'Invalid Order ID format',
                    error: error.message,
                });
            }

            console.error('Error fetching order:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
);

export default getOrderById;
