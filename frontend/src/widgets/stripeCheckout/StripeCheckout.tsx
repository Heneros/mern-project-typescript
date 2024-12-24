import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCreateCheckoutSessionMutation } from 'features/order/api/orderApiSlice';
import { loadStripe } from '@stripe/stripe-js';
import { handleError } from 'shared/utils/handleError';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC!);

type User = {
    _id: string;
};
const StripeCheckout = ({
    _id,
    orderItems,
    user,
}: {
    _id: string;
    orderItems: any[];
    user: User;
}) => {
    const [createCheckoutSession, { isLoading: stripeLoading }] =
        useCreateCheckoutSessionMutation();

    const handleCheckout = async () => {
        try {
            const response = await createCheckoutSession({
                items: orderItems,
                _id: _id,
                user,
            }).unwrap();
            const { sessionId } = response;

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe not loaded');
            }

            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMessage = handleError(error);
            toast.error(errorMessage || 'Error payment stripe');
        }
    };

    return (
        <div className="stripe-checkout">
            <Button
                className="mt-3 w-100"
                variant="success"
                onClick={handleCheckout}
            >
                Pay with Stripe
            </Button>
        </div>
    );
};

export default StripeCheckout;
