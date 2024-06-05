import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';

<<<<<<< HEAD
// import Header from '../../components/Header';
// import Header from './Header';
Header
=======
// import Header from './Header';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';

>>>>>>> a28dbdfda6c8b8c482daa1f9de97c0e581ce8cf6
export function Layout() {
    return (
        <>
            <Header />
            <Container>
                <Outlet />
            </Container>
            <Footer />
        </>
    );
}
