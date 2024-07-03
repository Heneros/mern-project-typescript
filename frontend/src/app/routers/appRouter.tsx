import React from 'react';

import {
    createBrowserRouter,
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
import { PasswordRequestPage } from 'pages/passwordrequestpage';
import { Login } from 'pages/login';
import { ResendEmailTokenPage } from 'pages/resendEmailTokenPage';
import { VerifiedPage } from 'pages/verifiedPage';

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { index: true, element: <HomePage /> },
                { path: 'properties', element: <Properties /> },
                {
                    path: '/properties/page/:pageNumber',
                    element: <Properties />,
                },
                { path: 'registration', element: <Registration /> },
                { path: 'login', element: <Login /> },
                { path: 'auth/reset_password', element: <PasswordReset /> },
                { path: 'auth/verify', element: <VerifiedPage /> },
                {
                    path: 'reset_password_request',
                    element: <PasswordRequestPage />,
                },
                {
                    path: 'resend',
                    element: <ResendEmailTokenPage />,
                },
                { path: '*', element: <NotFound /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};
