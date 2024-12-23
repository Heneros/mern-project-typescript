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
        refetch,
        isLoading: myOrderByIdLoading,
        error: errorOrder,
    } = useGetMyOrderByIdQuery(id);
    const navigate = useNavigate();
    const { orderItems } = order?.order || {};

    console.log(orderItems);
    useEffect(() => {
        const processPayment = async () => {
            try {
                // await payOrder({
                //     orderId: id,
                //     details: orderItems,
                // }).unwrap();
                await payOrder({
                    data: {
                        orderId: id,
                        details: orderItems,
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
        return <div>Error: {errorOrder.message}</div>;
    }

    return <div>Processing Payment...</div>;
};

export default Success;
