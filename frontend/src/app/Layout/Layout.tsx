import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Preloader } from 'shared/ui/Preloader';
import { ToastContainer } from 'react-toastify';
import ChatButtonModal from 'shared/ui/chatButtonModal/ChatButtonModal';

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
            <ChatButtonModal />
            <Footer />
        </>
    );
}
