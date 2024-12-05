import { useLoginUserMutation } from 'features/auth/authApiSlice';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch } from 'shared/lib/store';
import { LoginTypes } from 'shared/types';
import { logIn } from 'features/auth/authSlice';
import { Loader } from 'shared/ui/loader';
import { AuthButtonAnimation } from 'shared/ui/authButtonAnimation';
import { useAuthUser } from 'shared/hooks/useAuthUser';

export const FormLogin = () => {
    const initialValues: LoginTypes = {
        email: '',
        password: '',
        submit: null,
    };

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/personal-account';

    const [showPassword, setShowPassword] = useState(false);

    const handleShowHidePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent): void => {
        event.preventDefault();
    };

    const [loginUser, { data, isLoading, isSuccess }] = useLoginUserMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate(from, { replace: true });
        }
    }, [data, isSuccess, navigate, from]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                password: Yup.string()
                    .max(255)
                    .required('Password is required'),
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                    const getUserCredentials = await loginUser(values).unwrap();
                    dispatch(logIn({ ...getUserCredentials }));
                    setStatus({ success: true });
                    setSubmitting(false);
                } catch (err) {
                    const message = (err as { data: { message: string } })?.data
                        .message;
                    console.log(err);
                    // const message = err!.data!.message!;
                    toast.error(message);
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
                isValid,
                dirty,
            }) => (
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Row className="mt-3">
                            <Col xs={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label htmlFor="email-signIn">
                                        Email*
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        id="email-signIn"
                                        name="email"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter Email"
                                        isInvalid={
                                            !!errors.email && touched.email
                                        }
                                    />
                                    {touched.email && errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col xs={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label htmlFor="password-signIn">
                                        Password*
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            id="password-signIn"
                                            name="password"
                                            value={values.password}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            placeholder="******"
                                            isInvalid={
                                                !!errors.password &&
                                                touched.password
                                            }
                                        />

                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleShowHidePassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                        >
                                            {showPassword ? (
                                                <FontAwesomeIcon icon={faEye} />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faEyeSlash}
                                                />
                                            )}
                                        </Button>
                                        {touched.password &&
                                            errors.password && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            )}
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <AuthButtonAnimation>
                                    <Button
                                        disabled={
                                            isSubmitting || !(isValid && dirty)
                                        }
                                        className="w-100"
                                        size="lg"
                                        type="submit"
                                        variant="secondary"
                                    >
                                        Login
                                    </Button>
                                </AuthButtonAnimation>
                            </Col>
                        </Row>
                    )}
                </Form>
            )}
        </Formik>
    );
};
