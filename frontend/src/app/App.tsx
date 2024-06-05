import React from 'react';
import { Route, Routes } from 'react-router-dom';

// import HomePage from '../pages/homePage/ui/HomePage';
// import Properties from '../pages/properties/ui/Properties';
import { Layout } from './Layout/Layout';

import { HomePage } from 'pages/homePage/ui/HomePage';
import { Properties } from 'pages/properties/ui/Properties';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="properties" element={<Properties />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
