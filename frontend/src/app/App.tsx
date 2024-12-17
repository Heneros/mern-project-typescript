import React from 'react';

import { Providers } from './Providers/providers';
import { AppRouter } from './routers';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const App = () => {
    const initialOptions = {
        clientId: process.env.PAYPAL_CLIENT_ID!,
        currency: 'USD',
        intent: 'capture',
    };
    return (
        <Providers>
            <PayPalScriptProvider options={initialOptions}>
                <AppRouter />
            </PayPalScriptProvider>
        </Providers>
    );
};

export default App;
