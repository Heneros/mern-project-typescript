import React from 'react';
import { createBrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import HomePage from '../pages/HomePage/HomePage';
import Properties from '../pages/Properties/Properties';
import NotFound from '../pages/NotFound/NotFound';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
