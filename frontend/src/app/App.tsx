import React from 'react';

import { Providers } from './Providers/providers';
import { AppRouter } from './routers';


const App = () => {
    return (
        <Providers>
            <AppRouter />
        </Providers>
    );
};

export default App;
