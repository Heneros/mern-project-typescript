import React from 'react';
import { Container, Row } from 'react-bootstrap';
import {
    faCalendar,
    faEnvelope,
    faMap,
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faInstagram,
    faLinkedinIn,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';
import { DropdownCart } from 'entities/cartHeader';
import { useLogoutUserMutation } from 'features/auth/authApiSlice';
import { useAppSelector } from 'shared/lib/store';

export const Header = () => {
    const location = useLocation();
    const { data, isLoading, error } = useGetUserProfileQuery(undefined);
    const [logoutAction] = useLogoutUserMutation();
    // console.log(prof);

    const { user: userInfo } = useAppSelector((state) => state.auth);

    ///  console.log('userInfo', userInfo);

    const logoutHandler = async () => {
        try {
            await logoutAction(undefined).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const isCurrentPath = (path: string) => location.pathname === path;
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
            <header className="header-area header-sticky">
                <Container>
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                <Link to="/" className="logo">
                                    <h1>Villa</h1>
                                </Link>
                                <ul className="nav">
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
                                    {!userInfo ? (
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
                                    ) : (
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
                                    )}
                                    <DropdownCart />
                                </ul>
                                <span className="menu-trigger">
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
