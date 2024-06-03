import React from 'react';
import { Container } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Header = () => {
    return (
        <>
            <div className="sub-header">
                <Container>
                    <div className="row">
                        <div className="col-lg-8 col-md-8">
                            <ul className="info">
                                <li>
                                    {/* <i className="fa fa-envelope"></i>{' '} */}
                                    <FontAwesomeIcon icon={FaEnvelope} />
                                    info@company.com
                                </li>
                                <li>
                                    <i className="fa fa-map"></i> Sunny Isles
                                    Beach, FL 33160
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <ul className="social-links">
                                <li>
                                    <a href="#">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://x.com/minthu"
                                        target="_blank"
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </div>
            {/* 
  <!-- ***** Header Area Start ***** --> */}
            <header className="header-area header-sticky">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                {/* <!-- ***** Logo Start ***** --> */}
                                <a href="index.html" className="logo">
                                    <h1>Villa</h1>
                                </a>
                                {/* <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** --> */}
                                <ul className="nav">
                                    <li>
                                        <a href="index.html" className="active">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="properties.html">Properties</a>
                                    </li>
                                    <li>
                                        <a href="property-details.html">
                                            Property Details
                                        </a>
                                    </li>
                                    <li>
                                        <a href="contact.html">Contact Us</a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fa fa-calendar"></i>{' '}
                                            Schedule a visit
                                        </a>
                                    </li>
                                </ul>
                                <a className="menu-trigger">
                                    <span>Menu</span>
                                </a>
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
