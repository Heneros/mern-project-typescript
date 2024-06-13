import React from 'react';
import { Container } from 'react-bootstrap';
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
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <>
            <div className="sub-header">
                <Container>
                    <div className="row">
                        <div className="col-lg-8 col-md-8">
                            <ul className="info">
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    info@company.com
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faMap} />
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
                    </div>
                </Container>
            </div>
            {/* <!-- ***** Header Area Start ***** --> */}
            <header className="header-area header-sticky">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                {/* <!-- ***** Logo Start ***** --> */}
                                <Link to="/" className="logo">
                                    <h1>Villa</h1>
                                </Link>
                                {/* <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** --> */}
                                <ul className="nav">
                                    <li>
                                        <Link to="/" className="active">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/properties">Properties</Link>
                                    </li>

                                    <li>
                                        <Link to="/contact-us">Contact Us</Link>
                                    </li>
                                    <li>
                                        <Link to="/registration">
                                            Registration
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#!">
                                            {/* <i className="fa fa-calendar"></i>{' '} */}
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                            />
                                            Schedule a visit
                                        </Link>
                                    </li>
                                </ul>
                                <span className="menu-trigger">
                                    <span>Menu</span>
                                </span>
                                {/* <!-- ***** Menu End ***** --> */}
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            {/* <!-- ***** Header Area End ***** --> */}
        </>
    );
};
