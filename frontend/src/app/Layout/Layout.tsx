import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Preloader } from 'shared/ui/Preloader';
import { ToastContainer } from 'react-toastify';

export function Layout() {
    return (
        <>
            <Header />
            <Preloader />
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Outlet />
            <Footer />
        </>
    );
}
