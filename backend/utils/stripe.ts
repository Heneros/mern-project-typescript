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
    // console.log({ amount, orderId });
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: { orderId },
        });
        // console.log({ paymentIntent });
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
    // console.log(details);

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

const createCheckoutSession = asyncHandler(async (req, res) => {
    const { items, _id, user } = req.body;

    if (!_id) {
        console.error('Missing _id');
        res.status(400).json({ error: 'Order ID (_id) is required' });
        return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        console.error('Invalid items:', items);
        res.status(400).json({ error: 'Invalid items format or empty array' });
        return;
    }

    try {
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.preview],
                },
                unit_amount: item.price * 100,
            },
            quantity: 1,
        }));
        const domain =
            process.env.NODE_ENV === 'production'
                ? process.env.DOMAIN!
                : process.env.DOMAINCORS!;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // metadata: {
            //     email: user.email,
            // },
            success_url: `${domain}/success/${_id}`,
            cancel_url: `${domain}/cancel`,
        });

        // console.log('Session created:', session);
        // Return sessionId instead of sessionUrl
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

export { createIntent, confirmPayment, createCheckoutSession };
