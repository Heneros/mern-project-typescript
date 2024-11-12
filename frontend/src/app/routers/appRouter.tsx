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
import { AuthRequired } from 'shared/hooks/AuthRequired';
import { ROLES } from 'shared/consts';
import { PersonalAccount } from 'pages/personalAccount';
import { ContactUs } from 'pages/contactUs';
import { SingleProperty } from 'pages/singleProperty';
import AdminAllPosts from 'pages/admin/AdminAllPosts';

import AdminAllUsers from 'pages/admin/AdminAllUsers';
import AdminCreatePost from 'pages/admin/AdminCreatePost';
import AdminEditPost from 'pages/admin/AdminEditPost';
import AllOrders from 'pages/allOrders/AllOrders';

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
                {
                    path: 'contact-us',
                    element: <ContactUs />,
                },
                {
                    path: 'post/:id',
                    element: <SingleProperty />,
                },
                {
                    element: <AuthRequired allowedRoles={[ROLES.User]} />,
                    children: [
                        {
                            path: 'personal-account',
                            element: <PersonalAccount />,
                        },
                        {
                            path: '/personal-account/all-orders',
                            element: <AllOrders />,
                        },
                    ],
                },
                {
                    element: <AuthRequired allowedRoles={[ROLES.Admin]} />,
                    children: [
                        {
                            path: 'admin/all-posts',
                            element: <AdminAllPosts />,
                        },
                        {
                            path: 'admin/all-users',
                            element: <AdminAllUsers />,
                        },
                        {
                            path: 'admin/create-post',
                            element: <AdminCreatePost />,
                        },
                        {
                            path: 'admin/edit-post',
                            element: <AdminEditPost />,
                        },
                    ],
                },
                { path: '*', element: <NotFound /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};
