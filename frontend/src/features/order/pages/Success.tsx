import React, { useEffect } from 'react';
import {
    useGetMyOrderByIdQuery,
    usePayOrderMutation,
} from '../api/orderApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Success = () => {
    const { id } = useParams<{ id: string }>();
    const [payOrder] = usePayOrderMutation();
    const {
        data: order,
        isLoading: myOrderByIdLoading,
        error: errorOrder,
    } = useGetMyOrderByIdQuery(id);
    const navigate = useNavigate();
    const { orderItems, user } = order?.order || {};

    console.log(orderItems);
    useEffect(() => {
        const processPayment = async () => {
            try {
                await payOrder({
                    data: {
                        orderId: id,
                        updateTime: new Date().toISOString(),
                        paymentId: 'PAYMENT_ID_FROM_STRIPE',
                        paymentStatus: 'COMPLETED',
                        payerEmail: user.email,
                    },
                });
                toast.success('Payment successfully accomplished!!');
                navigate(`/order/${id}`);
            } catch (error) {
                console.error('Error during payment:', error);
            }
        };

        if (id && orderItems) {
            processPayment();
        }
    }, [id, orderItems, payOrder]);

    if (myOrderByIdLoading) {
        return <div>Loading...</div>;
    }

    if (errorOrder) {
        return <div>Error: {errorOrder?.message}</div>;
    }

    return <div>Processing Payment...</div>;
};

export default Success;
