import { Request, Response } from 'express';
import Property from '@/models/propertiesModel';
import { IOrder, IOrderItem } from '@/types/IOrderItem';
import { calcPrice } from '@/utils/calcPrice';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';

interface OrderType {
    [_id: string]: string;
}

const addOrderItem = async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }
    
    const userId = userReq.user._id;
    const { orderItems, paymentMethod } = req.body;

    if (orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
    }
    const itemsFromDB = await Property.find({
        _id: { $in: orderItems.map((x: OrderType) => x._id) },
    });

    const dbOrderItems: IOrderItem[] = orderItems.map(
        (itemFromClient: IOrderItem) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) =>
                    itemFromDB._id.toString() === itemFromClient._id,
            );
            return {
                ...itemFromClient,
                property: itemFromClient?._id,
                price: matchingItemFromDB?.price || 0,
                _id: undefined,
            };
        },
    );

    const { itemsPrice, taxPrice, totalPrice } = calcPrice(dbOrderItems);

    const order: IOrder = new Order({
        orderItems: dbOrderItems,
        user: userId,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

export default addOrderItem;
