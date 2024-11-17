import { useRegisterUserMutation } from 'features/auth/authApiSlice';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    strengthColor,
    strengthIndicator,
} from 'shared/utils/password-strength';
import { PasswordStrength, SignUpType } from 'shared/types';
import { GoogleAuth } from 'shared/ui/GoogleAuth';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import Featured from 'shared/assets/images/featured.jpg';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GithubAuth from 'shared/ui/GithubAuth/GithubAuth';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

export const Registration = () => {
    const initialValues: SignUpType = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        submit: null,
    };
    const navigate = useNavigate();
    const [level, setLevel] = useState<PasswordStrength>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowHidePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleShowHideConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (e: React.MouseEvent<InputEvent>) => {
        e.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    const [registerUser, { data, isLoading, isSuccess }] =
        useRegisterUserMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate('/');

            const message = data?.message;
            toast.success(message);
        }
    }, [data, isSuccess, navigate]);

    return (
        <>
            <Breadcrumbs bgImg={Featured} nameParent={'Registration'} />
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
                        <h1>Registration</h1>
                    </Col>
                </Row>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object().shape({
                        firstName: Yup.string()
                            .max(255)
                            .required('First Name is required'),
                        lastName: Yup.string()
                            .max(255)
                            .required('Last Name is required'),
                        username: Yup.string()
                            .matches(
                                USERNAME_REGEX,
                                'Should be between 4 and 24 characters. Letters, numbers, underscores, hyphens allowed. Special characters not allowed!',
                            )
                            .required('A username is required'),
                        email: Yup.string()
                            .email('Must be a valid email')
                            .max(255)
                            .required('Email is required'),
                        password: Yup.string()
                            .max(255)
                            .required('Password is required'),
                        passwordConfirm: Yup.string()
                            .oneOf(
                                [Yup.ref('password')],
                                'Passwords Must Match',
                            )
                            .required('Please confirm your password'),
                    })}
                    onSubmit={async (
                        values: SignUpType,
                        { setStatus, setSubmitting, resetForm },
                    ) => {
                        try {
                            await registerUser(values).unwrap();
                            setStatus({ success: true });
                            resetForm();
                            toast.success('Check your email');
                            setSubmitting(true);
                        } catch (err) {
                            const message = (
                                err as { data: { message: string } }
                            )?.data.message;

                            toast.error(message);
                            //  console.log(message);
                            setStatus({ success: false });
                            setSubmitting(false);
                        }
                    }}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                    }) => (
                        <Form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            <Row className="mt-3">
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="firstName">
                                        <Form.Label>First Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            value={values.firstName}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Enter First Name"
                                            isInvalid={
                                                !!errors.firstName &&
                                                touched.firstName
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="lastName-signup">
                                        <Form.Label>Last Name*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            value={values.lastName}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            isInvalid={
                                                !!errors.lastName &&
                                                touched.lastName
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="username-signup">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="john-doe, john88"
                                            isInvalid={
                                                !!errors.username &&
                                                touched.username
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Form.Group controlId="email-signup">
                                        <Form.Label>Email Address*</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="email@example.com"
                                            isInvalid={
                                                !!errors.email && touched.email
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="password-signup">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="password"
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleChange(e);
                                                changePassword(e.target.value);
                                            }}
                                            placeholder="Enter Password"
                                            isInvalid={
                                                !!errors.password &&
                                                touched.password
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleShowHidePassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    </Form.Group>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Form.Group controlId="passwordConfirm-signup">
                                        <Form.Label>
                                            Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            name="passwordConfirm"
                                            value={values.passwordConfirm}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="******"
                                            isInvalid={
                                                !!errors.passwordConfirm &&
                                                touched.passwordConfirm
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwordConfirm}
                                        </Form.Control.Feedback>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={
                                                handleShowHideConfirmPassword
                                            }
                                        >
                                            {showConfirmPassword
                                                ? 'Hide'
                                                : 'Show'}
                                        </Button>
                                    </Form.Group>
                                </Col>
                                {errors.submit && (
                                    <Col md={12}>{errors.submit}</Col>
                                )}
                                <Col md={12}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                    >
                                        Create Account
                                    </Button>
                                </Col>
                                <Col md={12} className="my-2">
                                    <Link to={'/login'}>
                                        Already have an account?
                                    </Link>
                                </Col>
                                <Col md={12} className="my-2">
                                    Sign up with Google or Github
                                    <Row className="d-flex mt-4">
                                        <Col xs="auto">
                                            <GoogleAuth />
                                        </Col>
                                        <Col xs="auto">
                                            <GithubAuth />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Container>
        </>
    );
};
