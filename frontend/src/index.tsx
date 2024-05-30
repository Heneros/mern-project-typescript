import React, { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import {
    BrowserRouter as Router, Route, Routes, createBrowserRouter,
} from 'react-router-dom';
import App from './components/App';
import Layout from './components/Layout';
import HomePage from './pages/HomePage/HomePage';
import Properties from './pages/Properties/Properties';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <Router>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </Router>
        </StrictMode>,
    );
}
