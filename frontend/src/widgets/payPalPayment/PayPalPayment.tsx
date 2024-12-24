import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetPaypalClientIdQuery } from 'features/order/api/orderApiSlice';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

interface PayPalPaymentProps {
    orderId: string;
    totalPrice: number;
    isPaid: boolean;
    onPaymentSuccess: (details: any) => Promise<void>;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
    orderId,
    totalPrice,
    isPaid,
    onPaymentSuccess,
}) => {
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery(undefined);
    useEffect(() => {
        if (totalPrice) {
            const loadPaypalScript = () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending',
                });
            };

            if (!isPaid && !window.paypal) {
                loadPaypalScript();
            }
        }
    }, [totalPrice, isPaid, paypalDispatch]);

    const createOrder = (data: any, actions: any) => {
        if (!totalPrice) {
            toast.error('Total price is missing');
            return Promise.reject(new Error('Total price is missing'));
        }
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: totalPrice.toFixed(2),
                        },
                    },
                ],
            })
            .then((orderId: string) => orderId);
    };

    const onApprove = (data: any, actions: any) => {
        return actions.order.capture().then(onPaymentSuccess);
    };

    const onError = (err: any) => {
        console.error(err);
        toast.error('PayPal payment failed. Please try again.');
    };

    return (
        <>
            {isPending ? (
                <div>Loading PayPal Buttons...</div>
            ) : (
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                />
            )}
        </>
    );
};

export default PayPalPayment;
