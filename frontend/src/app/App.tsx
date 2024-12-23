import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { Providers } from './Providers/providers';
import { AppRouter } from './routers';

const App = () => {
    const [stripePromise, setStripePromise] =
        useState<Promise<Stripe | null> | null>(null);
    const [isStripeReady, setIsStripeReady] = useState(false);

    const initialPayPalOptions = {
        clientId: process.env.PAYPAL_CLIENT_ID!,
        currency: 'USD',
        intent: 'capture',
    };

    useEffect(() => {
        const initStripe = async () => {
            try {
                const stripe = await loadStripe(process.env.STRIPE_PUBLIC!);
                setStripePromise(Promise.resolve(stripe));
                setIsStripeReady(true);
            } catch (error) {
                console.error('Failed to load Stripe:', error);
            }
        };
        initStripe();
    }, []);

    if (!stripePromise) {
        return <div>Loading payment providers...</div>;
    }

    return (
        <Providers>
            <Elements stripe={stripePromise}>
                <PayPalScriptProvider options={initialPayPalOptions}>
                    <AppRouter />
                </PayPalScriptProvider>
            </Elements>
        </Providers>
    );
};

export default App;
