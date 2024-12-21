import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { Providers } from './Providers/providers';
import { AppRouter } from './routers';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';

const App = () => {
    const initialOptions = {
        clientId: process.env.PAYPAL_CLIENT_ID!,
        currency: 'USD',
        intent: 'capture',
    };
    const stripePromise = loadStripe(process.env.STRIPE_PUBLIC as string);

    return (
        <Providers>
            <Elements stripe={stripePromise}>
                <PayPalScriptProvider options={initialOptions}>
                    <AppRouter />
                </PayPalScriptProvider>
            </Elements>
        </Providers>
    );
};

export default App;
