import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    useCreateStripeIntentMutation,
    usePayOrderMutation,
} from 'features/order/api/orderApiSlice';

const StripeCheckout = ({
    _id,
    orderItems,
    totalPrice,
}: {
    _id: string;
    orderItems: any[];
    totalPrice: number;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const [createStripeIntent] = useCreateStripeIntentMutation();
    const [payOrder] = usePayOrderMutation();

    const handleStripePayment = async () => {
        if (!stripe || !elements) {
            toast.error('Stripe is not ready');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error('Card details are missing');
            return;
        }

        setIsProcessing(true);

        try {
            const { clientSecret } = await createStripeIntent({
                amount: totalPrice * 100,
                orderId: _id,
            }).unwrap();

            const paymentResult = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                },
            );

            if (paymentResult.error) {
                toast.error(paymentResult.error.message);
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                await payOrder({ orderId: _id, details: orderItems }).unwrap();
                toast.success('Payment successful!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="stripe-checkout">
            <CardElement />
            <Button
                className="mt-3 w-100"
                variant="success"
                onClick={handleStripePayment}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
        </div>
    );
};

export default StripeCheckout;
