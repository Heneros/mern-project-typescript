import React from 'react';
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js';
const StripeCheckout = ({
    orderId,
    amount,
    onApprove,
}: {
    orderId: string;
    amount: number;
    onApprove: () => void;
}) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                orderId={orderId}
                amount={amount}
                onSuccess={onApprove}
            />
        </Elements>
    );
};

export default StripeCheckout;
