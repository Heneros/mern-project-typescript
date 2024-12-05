import React from 'react';
import { Link } from 'react-router-dom';
import { ContactUsForm } from 'widgets/contactUsForm';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import PhoneIcon from 'shared/assets/icons/phone-icon.png';
import EmailIcon from 'shared/assets/icons/email-icon.png';

import './ContactUs.css';

export const ContactUs = () => {
    return (
        <>
            <Breadcrumbs nameParent={'Contact Us'} />
            <div className="contact-page section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="section-heading">
                                <h6>| Contact Us</h6>
                                <h2>Get In Touch With Our Agents</h2>
                            </div>

                            <p>
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Ex aliquam aperiam numquam.
                                Velit, ducimus. Nisi ab asperiores ea libero qui
                                voluptatem dolores, perspiciatis quo dolorem
                                totam placeat provident cumque reiciendis
                                mollitia veniam dolore soluta harum magni vero
                                deleniti. Fugit accusantium illo itaque veniam
                                est cumque, quisquam provident expedita at
                                consectetur impedit aut ab, autem nostrum non
                                debitis dolorem deserunt laboriosam alias?
                                Consectetur architecto a corporis voluptas
                                quaerat provident ratione tenetur laborum
                                aliquid. Expedita, laboriosam fugiat!
                            </p>
                            <div className="row">
                                <div className="col-lg-12">
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
                                <div className="col-lg-12">
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
                        <div className="col-lg-6">
                            <ContactUsForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
