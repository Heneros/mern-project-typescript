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

export const AppRouter = () => {
    const routes = createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/registration" element={<Registration />} />
        </Route>,
    );

    const router = createHashRouter(routes, {});

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};
