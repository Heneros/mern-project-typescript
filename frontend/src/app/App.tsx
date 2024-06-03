import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import Properties from '../pages/Properties';
import { Layout } from './Layout/Layout';

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
