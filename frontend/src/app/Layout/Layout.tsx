import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';

// import Header from '../../components/Header';
// import Header from './Header';
Header
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
