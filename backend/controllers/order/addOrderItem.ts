import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Property from '@/models/propertiesModel';
import { IOrder, IOrderItem } from '@/types/IOrderItem';
import { calcPrice } from '@/utils/calcPrice';
import Order from '@/models/orderModel';
import { RequestWithUser } from '@/types/RequestWithUser';
import { systemLogs } from '@/utils/Logger';

interface OrderType {
    property: string;
}
const addOrderItem = async (req: Request, res: Response): Promise<void> => {
    const userReq = req as RequestWithUser;

    if (!userReq.user) {
        res.status(404).json({ message: 'Not found Request' });
        return;
    }

    const userId = userReq.user._id;
    const { orderItems, paymentMethod, paypalOrderId } = req.body;

    if (orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    const itemsFromDB = await Property.find({
        _id: { $in: orderItems.map((x: OrderType) => x.property) },
    });

    const dbOrderItems: IOrderItem[] = orderItems.map(
        (itemFromClient: IOrderItem) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) =>
                    itemFromDB._id.toString() ===
                    String(itemFromClient.property),
            );
            return {
                ...itemFromClient,
                property: itemFromClient.property,
                price: matchingItemFromDB?.price || 0,
                _id: new mongoose.Types.ObjectId(),
            };
        },
    );

    const { itemsPrice, taxPrice, totalPrice } = calcPrice(dbOrderItems);

    try {
        const order: IOrder = new Order({
            orderItems: dbOrderItems,
            user: userId,
            paymentMethod,
            paypalOrderId,
            itemsPrice,
            taxPrice,
            totalPrice,
        });

        if (paypalOrderId) {
            const existingOrder = await Order.findOne({ paypalOrderId });
            if (existingOrder) {
                res.status(400).json({
                    message: 'Order with this PayPal ID already exists',
                });
                return;
            }
        }

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        systemLogs.error(`Add orders ${error}`);
        res.status(500).json({
            message: 'Error creating order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
export default addOrderItem;
