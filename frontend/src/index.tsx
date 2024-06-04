import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from 'app/App';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const container = document.querySelector('#root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </Router>
    </React.StrictMode>,
);
