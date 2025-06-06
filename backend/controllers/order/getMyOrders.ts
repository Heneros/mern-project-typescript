import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '@/backend/models/orderModel';
import { RequestWithUser } from '@/backend/types/RequestWithUser';
import { pageSize } from '@/backend/constants';

const getMyOrders = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const userReq = req as RequestWithUser;
        const page = Number(req.query.page) || 1;
        const count = await Order.countDocuments({});

        if (!userReq.user) {
            res.status(404).json({ message: 'Not user found Request' });
            return;
        }

        const userId = userReq.user._id;
        const orders = await Order.find({ user: userId })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .exec();
        res.status(200).json({
            orders,
            count,
            numberOfPages: Math.ceil(count / pageSize),
        });
    },
);

export default getMyOrders;
