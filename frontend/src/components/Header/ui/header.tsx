import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { faEnvelope, faMap } from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faInstagram,
    faLinkedinIn,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { DropdownCart } from 'entities/СartHeader/index';
import { useLogoutUserMutation } from 'features/auth/authApiSlice';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';

import './header.css';
import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
} from 'features/auth/authSlice';

export const Header = () => {
    const menuRef = useRef<HTMLUListElement>(null);
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [logoutAction] = useLogoutUserMutation();
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    const { user: userInfo } = useAppSelector((state) => state.auth);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);

    const handleOpenMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isMobile) {
            setOpen((prevOpen) => !prevOpen);
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(e.target as Node) &&
            headerRef.current &&
            !headerRef.current.contains(e.target as Node)
        ) {
            setOpen(false);
        }
    };

    const logoutHandler = async () => {
        try {
            await dispatch(logoutAction(undefined)).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const isCurrentPath = (path: string) => location.pathname === path;

    useLayoutEffect(() => {
        // const header = headerRef.current;
        // const sticky = header?.offsetTop;

        const handleScroll = () => {
            const header = headerRef.current;
            if (header) {
                setIsSticky(window.scrollY > header.offsetTop);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isLoggedIn = Boolean(userInfo || tokenGoogle || tokenGithub);
    return (
        <>
            <div className="sub-header">
                <Container>
                    <Row>
                        <div className="col-lg-8 col-md-8">
                            <ul className="info">
                                <li>
                                    <FontAwesomeIcon
                                        size="lg"
                                        style={{
                                            color: '#f35525',
                                            margin: '0 8px',
                                        }}
                                        icon={faEnvelope}
                                    />
                                    <Link
                                        style={{ color: '#7a7a7a' }}
                                        to={'mailto:info@company.com'}
                                    >
                                        info@company.com
                                    </Link>
                                </li>
                                <li>
                                    <FontAwesomeIcon
                                        size="lg"
                                        style={{
                                            color: '#f35525',
                                            margin: '0 8px',
                                        }}
                                        icon={faMap}
                                    />
                                    Sunny Isles Beach, FL 33160
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <ul className="social-links">
                                <li>
                                    <Link to="#!">
                                        <FontAwesomeIcon icon={faFacebookF} />
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="https://x.com/minthu"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!">
                                        <FontAwesomeIcon icon={faLinkedinIn} />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Row>
                </Container>
            </div>
            {/* <!-- ***** Header Area Start ***** --> */}
            <header
                ref={headerRef}
                className={`header-area header-sticky ${isSticky ? 'background-header' : ''}`}
            >
                <Container>
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                <Link to="/" className="logo">
                                    <h1>Villa</h1>
                                </Link>
                                <ul
                                    ref={menuRef}
                                    className={`nav ${open ? 'show' : ''}`}
                                    style={{
                                        display: isMobile
                                            ? open
                                                ? 'block'
                                                : 'none'
                                            : '',
                                    }}
                                >
                                    <li>
                                        <Link
                                            to="/"
                                            className={
                                                isCurrentPath('/')
                                                    ? 'active'
                                                    : ''
                                            }
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/properties"
                                            className={
                                                isCurrentPath('/properties')
                                                    ? 'active'
                                                    : ''
                                            }
                                        >
                                            Properties
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/contact-us"
                                            className={
                                                isCurrentPath('/contact-us')
                                                    ? 'active'
                                                    : ''
                                            }
                                        >
                                            Contact Us
                                        </Link>
                                    </li>
                                    {isLoggedIn ? (
                                        <>
                                            <li>
                                                <Link
                                                    to="/personal-account"
                                                    className={
                                                        isCurrentPath(
                                                            '/personal-account',
                                                        )
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    Personal Account
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to=""
                                                    onClick={logoutHandler}
                                                >
                                                    Log Out
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <Link
                                                    to="/registration"
                                                    className={
                                                        isCurrentPath(
                                                            '/registration',
                                                        )
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    Registration
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <DropdownCart />
                                </ul>
                                <span
                                    onClick={handleOpenMenu}
                                    className={
                                        isMobile
                                            ? open
                                                ? 'menu-trigger active'
                                                : 'menu-trigger'
                                            : 'menu-trigger'
                                    }
                                >
                                    <span>Menu</span>
                                </span>
                                {/* <!-- ***** Menu End ***** --> */}
                            </nav>
                        </div>
                    </div>
                </Container>
            </header>
            {/* <!-- ***** Header Area End ***** --> */}
        </>
    );
};
