import { Types } from 'mongoose';

export interface IOrderItem {
    _id: string;
    title: string;

    preview: string;
    price: number;
    property: Types.ObjectId;
}

export interface PaymentResult {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}

export interface IOrder {
    orderItems: IOrderItem[];
    paymentResult?: PaymentResult;
    user: Types.ObjectId;
    paypalOrderId: string;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    paidAt?: Date;
    save(): Promise<IOrder>;
}
