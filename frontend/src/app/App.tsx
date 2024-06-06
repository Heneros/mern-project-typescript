import React from 'react';
import { Route, Routes } from 'react-router-dom';

// import HomePage from '../pages/homePage/ui/HomePage';
// import Properties from '../pages/properties/ui/Properties';
import { Layout } from './Layout/Layout';

import { HomePage } from 'pages/homePage/ui/HomePage';
import { Properties } from 'pages/properties/ui/Properties';
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
