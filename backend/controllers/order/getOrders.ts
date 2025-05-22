import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/models/orderModel';
import { pageSize } from '@/constants';

const getOrders = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const count = await Order.countDocuments({});

            const orders = await Order.find({})
                .limit(pageSize)
                .skip(pageSize * (page - 1))
                .populate('user', 'id username')
                .exec();

            res.status(200).json({
                orders,
                count,
                numberOfPages: Math.ceil(count / pageSize),
            });
        } catch (error) {
            console.error(error);
        }
    },
);

export default getOrders;
