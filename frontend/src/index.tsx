import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from 'app/App';

const container = document.querySelector('#root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
