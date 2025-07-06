import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useResendVerifyEmailMutation } from 'features/auth/authApiSlice';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Loader } from 'shared/ui/loader';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';

export const ResendEmailTokenPage = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const [resendVerifyEmail, { data, isLoading, isSuccess }] =
        useResendVerifyEmailMutation();

    useEffect(() => {
        if (isSuccess) {
            //  navigate('/');
            const message = data.message;
            toast.success(message);
        }
    }, [data, isSuccess, navigate]);

    return (
        <>
            <Breadcrumbs nameParent="Resend Email" />
            <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('Must be a valid email')
                        .max(255)
                        .required('Email is required'),
                })}
                onSubmit={async (values, { setStatus, setSubmitting }) => {
                    try {
                        await resendVerifyEmail(values).unwrap();
                        setStatus({ success: true });
                        setSubmitting(false);
                    } catch (err) {
                        // const message = (err as string)?.data?.message;
                        const message = (err as { data: { message: string } })
                            ?.data.message;
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
                    <Container
                        className="py-3 my-3 border border-2 rounded-4"
                        style={{ maxWidth: '540px' }}
                    >
                        <Row className="justify-content-center mb-3">
                            <Col className="d-flex justify-content-center align-items-center">
                                <h1>Resend Email</h1>
                            </Col>
                        </Row>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <Form
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit}
                            >
                                <Row className="mt-3">
                                    <Col xs={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label htmlFor="email-request">
                                                Email Address*
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                id="email-request"
                                                value={values.email}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Email"
                                                isInvalid={
                                                    !!errors.email &&
                                                    touched.email
                                                }
                                            />
                                            {touched.email && errors.email && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Button
                                        disabled={
                                            isSubmitting || !(isValid && dirty)
                                        }
                                        className="w-100"
                                        size="lg"
                                        type="submit"
                                        variant="secondary"
                                    >
                                        Resend Email
                                    </Button>
                                </Row>
                            </Form>
                        )}
                    </Container>
                )}
            </Formik>
        </>
    );
};
