import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

import Order from '@/models/orderModel';

const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
    try {
        let order = await Order.findById(req.params.id);

        // if (!order) {
        //     order = await Order.findOne({
        //         $or: [
        //             { _id: req.params.id },
        //             { 'paymentResult.id': req.params.id },
        //         ],
        //     });
        // }

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({
                message: 'Invalid order ID format',
                error: error.message,
            });
            return;
        }

        console.error('Error updating order:', error);
        res.status(500).json({
            message: 'Error updating order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default updateOrderToPaid;
