import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';
import { OrderDocument } from '@/types/OrderDocument';

export const updateOrderToPaid = asyncHandler(
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.id).exec();

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
        }
        const existingOrder = order!;

        existingOrder.isPaid = true;
        existingOrder.paidAt = new Date();
        existingOrder.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const updatedOrder = await existingOrder.save();
        res.status(200).json({ updatedOrder });
    },
);

export default updateOrderToPaid;
