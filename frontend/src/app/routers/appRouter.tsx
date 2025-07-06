import React from 'react';

import {
    createBrowserRouter,
    createHashRouter,
    createRoutesFromElements,
    Link,
    Route,
    RouterProvider,
} from 'react-router-dom';
import { Layout } from 'app/Layout';

import { HomePage } from 'pages/homePage';
import { Properties } from 'features/properties/pages/properties';
import { Registration } from 'features/auth/pages/registration';
import { NotFound } from 'pages/notfound';
import { PasswordReset } from 'features/auth/pages/passwordreset';
import { PasswordRequestPage } from 'features/auth/pages/passwordrequestpage';
import { Login } from 'features/auth/pages/login';
import { ResendEmailTokenPage } from 'features/auth/pages/resendEmailTokenPage';
import { VerifiedPage } from 'features/auth/pages/verifiedPage';
import { AuthRequired } from 'shared/hooks/AuthRequired';
import { ROLES } from 'shared/consts';
import { PersonalAccount } from 'features/user/pages/PersonalAccount';
import { ContactUs } from 'pages/contactUs';
import { SingleProperty } from 'features/properties/pages/singleProperty';
import AdminAllPosts from 'features/user/pages/admin/AdminAllPosts';

import AdminAllUsers from 'features/user/pages/admin/AdminAllUsers';
import AdminCreatePost from 'features/user/pages/admin/AdminCreatePost';
import AdminEditPost from 'features/user/pages/admin/AdminEditPost';
import AllOrders from 'pages/allOrders/AllOrders';
import Order from 'features/order/pages/Order';
import Cart from 'features/order/pages/Cart';
import PaymentMethod from 'features/order/pages/PaymentMethod';
import PlaceOrder from 'features/order/pages/PlaceOrder';
import Success from 'features/order/pages/Success';

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
                {
                    path: 'reset_password_request',
                    element: <PasswordRequestPage />,
                },
                { path: 'auth/verify', element: <VerifiedPage /> },

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
                    path: 'cart',
                    element: <Cart />,
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
                        {
                            path: '/payment-method',
                            element: <PaymentMethod />,
                        },
                        {
                            path: '/place-order',
                            element: <PlaceOrder />,
                        },

                        {
                            path: '/order/:id',
                            element: <Order />,
                        },
                        {
                            path: '/success/:id',
                            element: <Success />,
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
                            path: 'admin/all-posts/:pageNumber',
                            element: <AdminAllPosts />,
                        },
                        {
                            path: 'admin/all-users',
                            element: <AdminAllUsers />,
                        },
                        {
                            path: 'admin/all-users/:pageNumber',
                            element: <AdminAllUsers />,
                        },
                        {
                            path: 'admin/create-post',
                            element: <AdminCreatePost />,
                        },

                        {
                            path: 'admin/post/:id/edit',
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
