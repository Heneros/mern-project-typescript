import React from 'react';

import {
    createHashRouter,
    createRoutesFromElements,
    Link,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { Layout } from 'app/layout';

import { HomePage } from 'pages/homePage';
import { Properties } from 'pages/properties';
import { Registration } from 'pages/registration';
import { NotFound } from 'pages/notfound';
import { PasswordReset } from 'pages/passwordreset';

export const AppRouter = () => {
    const router = createHashRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: 'properties', element: <Properties /> },
                { path: 'registration', element: <Registration /> },
                { path: 'auth/reset_password', element: <PasswordReset /> },
                { path: '*', element: <NotFound /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};
