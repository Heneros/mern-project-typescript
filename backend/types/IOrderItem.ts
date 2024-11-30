import { Types } from 'mongoose';

export interface IOrderItem {
    _id: string;
    title: string;
    qty: number;
    preview: string;
    price: number;
    property?: string;
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
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    paidAt?: Date;
    save(): Promise<IOrder>;
}
