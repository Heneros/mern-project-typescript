import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';

import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Preloader } from 'shared/ui/Preloader';

export function Layout() {
    return (
        <>
            <Header />
            <Preloader />
            <Outlet />
            <Footer />
        </>
    );
}
