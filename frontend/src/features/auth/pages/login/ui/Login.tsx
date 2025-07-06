import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { FormLogin } from 'shared/ui/FormLogin';
import GithubAuth from 'shared/ui/githubAuth/GithubAuth';
import { GoogleAuth } from 'shared/ui/GoogleAuth';

export const Login = () => {
    return (
        <>
            <Breadcrumbs />
            <Container
                className="py-3 my-3 border border-2 rounded-4"
                style={{ maxWidth: '540px' }}
            >
                <Row className="justify-content-center mb-3">
                    <Col
                        xs={12}
                        className="auto d-flex justify-content-center  "
                    >
                        <FontAwesomeIcon icon={faRightToBracket} size="4x" />
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <h1>Log In</h1>
                    </Col>
                </Row>
                {/* Login Form */}
                <FormLogin />
                {/* Login Form */}
                <Row className="my-3">
                    <Col xs={12}>
                        <div className="d-flex align-items-center">
                            <hr className="flex-grow-1" />
                            <Button
                                variant="outline-secondary"
                                disabled
                                className="mx-2 rounded-pill"
                            >
                                OR LOG IN WITH GOOGLE
                            </Button>
                            <hr className="flex-grow-1" />
                        </div>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} className="text-center">
                        <GoogleAuth />
                    </Col>
                    <Col xs={12} className="text-center">
                        <GithubAuth />
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} className="text-center">
                        <h6>
                            Don't have an account?
                            <Link
                                to="/registration"
                                className="text-decoration-none"
                            >
                                Sign Up Here
                            </Link>
                        </h6>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-3">
                    <Col xs={12} className="text-center">
                        <h6>
                            Didn't get the verification email?{' '}
                            <Link to="/resend" className="text-decoration-none">
                                Resend
                            </Link>
                        </h6>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col xs={12} className="text-center">
                        <h6>
                            Lost password?
                            <Link
                                to="/reset_password_request"
                                className="text-decoration-none"
                            >
                                New password
                            </Link>
                        </h6>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
