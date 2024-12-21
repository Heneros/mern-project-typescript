import express from 'express';
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET!);

const createIntent = asyncHandler(async (req, res) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
        res.status(400).json({ message: 'Amount and orderId are required' });
        return;
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: { orderId },
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            message: 'Unable to create payment intent',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
const confirmPayment = asyncHandler(async (req, res) => {
    const { paymentIntentId, details } = req.body;

    if (!paymentIntentId) {
        res.status(400).json({
            message: 'Payment Intent ID is required',
        });
        return;
    }
    console.log(details);

    try {
        const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            res.status(200).json({ message: 'Payment successful' });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            message: 'Unable to confirm payment',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
export { createIntent, confirmPayment };
