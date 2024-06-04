import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';

// import Header from './Header';
import { Header } from 'widgets/header';

export function Layout() {
    return (
        <>
            <Header />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}
