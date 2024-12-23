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
    const stripe = loadStripe(
        'pk_test_51Kfwo6IDfKx1lWo4MFsDTUZ63BDX3OJylj7AYm52L2UYXE0IIpYN42gU5QgxgvyKVFbI7fBmbP9KUBJsYzq2zuro00OLP9j6uV',
    );

    return (
        <Providers>
            <Elements stripe={stripe}>
                <PayPalScriptProvider options={initialOptions}>
                    <AppRouter />
                </PayPalScriptProvider>
            </Elements>
        </Providers>
    );
};

export default App;
