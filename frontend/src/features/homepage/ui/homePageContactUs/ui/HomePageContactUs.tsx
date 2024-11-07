import React from 'react';
import { Link } from 'react-router-dom';
import ImageBg from 'shared/assets/images/contact-bg.jpg';
import PhoneIcon from 'shared/assets/icons/phone-icon.png';
import EmailIcon from 'shared/assets/icons/email-icon.png';

import './HomePageContactUs.css';
import { ContactUsForm } from 'widgets/contactUsForm';

export const HomePageContactUs = () => {
    return (
        <>
            <div
                className="contact section"
                style={{ backgroundImage: `url(${ImageBg})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">
                            <div className="section-heading text-center">
                                <h6>| Contact Us</h6>
                                <h2>Get In Touch With Our Agents</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contact-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <div id="map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12469.776493332698!2d-80.14036379941481!3d25.907788681148624!2m3!1f357.26927939317244!2f20.870722720054623!3f0!3m2!1i1024!2i768!4f35!3m3!1m2!1s0x88d9add4b4ac788f%3A0xe77469d09480fcdb!2sSunny%20Isles%20Beach!5e1!3m2!1sen!2sth!4v1642869952544!5m2!1sen!2sth"
                                    width="100%"
                                    height="500px"
                                    frameBorder="0"
                                    style={{
                                        border: '0',
                                        borderRadius: '10px',
                                        boxShadow:
                                            '0px 0px 15px rgba(0, 0, 0, 0.15)',
                                    }}
                                    allowFullScreen
                                />
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="item phone">
                                        <img
                                            src={PhoneIcon}
                                            alt=""
                                            style={{ maxWidth: '52px' }}
                                        />
                                        <h6>
                                            <Link
                                                className="link-con"
                                                to={`tel:0100200340`}
                                            >
                                                010-020-0340
                                            </Link>
                                            <br />
                                            <span>Phone Number</span>
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="item email">
                                        <img
                                            src={EmailIcon}
                                            alt=""
                                            style={{ maxWidth: '52px' }}
                                        />
                                        <h6>
                                            <Link
                                                className="link-con"
                                                to={`mailto:info@villa.co`}
                                            >
                                                info@villa.co
                                            </Link>
                                            <br />
                                            <span>Business Email</span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <ContactUsForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
