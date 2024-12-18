import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

import Order from '@/models/orderModel';

const updateOrderToPaid = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Order ID' });
            return;
        }
        try {
            // const orderId = new mongoose.Types.ObjectId(id);

            const order = await Order.findById(id);

            if (!order) {
                res.status(404).json({ message: 'Order not found' });
                return;
            }

            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address:
                    req.body.payer?.email_address || 'email_address@gmail.com',
            };

            const updatedOrder = await order.save();

            res.status(200).json(updatedOrder);
        } catch (error) {
            // Comprehensive error handling
            console.error('Error updating order:', error);

            // if (error instanceof mongoose.Error.CastError) {
            //     res.status(400).json({
            //         message: 'Invalid Order ID',
            //         error: error.message,
            //     });
            //     return;
            // }

            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
);
export default updateOrderToPaid;
