import React, { useEffect } from 'react';
import { useFeedbackFormMutation } from 'features/auth/authApiSlice';
import { FeedbackType } from 'shared/types';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Col, Row, Button } from 'react-bootstrap';
import './ContactUsForm.css';

export const ContactUsForm = () => {
    const initialValues: FeedbackType = {
        name: '',
        subject: '',
        email: '',
        message: '',
        submit: null,
    };

    const [feedbackAction, { data, isLoading, isSuccess, error }] =
        useFeedbackFormMutation();

    useEffect(() => {
        if (error) {
            const message = data?.error;
            toast.error(message);
        }
    }, [data, error]);

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(70).required('Name is required'),
                    email: Yup.string()
                        .email('Must be a valid email')
                        .max(80)
                        .required('Email is required'),
                    message: Yup.string()
                        .max(370)
                        .required('Message is required'),
                    subject: Yup.string()
                        .max(70)
                        .required('Subject is required'),
                })}
                onSubmit={async (
                    values: FeedbackType,
                    { setStatus, setSubmitting, resetForm },
                ) => {
                    try {
                        await feedbackAction(values).unwrap();
                        setStatus({ success: true });
                        resetForm();
                        toast.success('Message was sent!');
                    } catch (err) {
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
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    handleBlur,
                    touched,
                    values,
                }) => (
                    <>
                        <Form
                            id="contact-form"
                            onSubmit={handleSubmit}
                            noValidate
                            autoComplete="off"
                        >
                            <Row>
                                <Col lg={12}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="name"
                                            name="name"
                                            value={values.name}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Your Name..."
                                            isInvalid={
                                                !!errors.name && touched.name
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Your Email..."
                                            isInvalid={
                                                !!errors.email && touched.email
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Form.Group controlId="subject">
                                        <Form.Label>Subject </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={values.subject}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Your Subject..."
                                            isInvalid={
                                                !!errors.subject &&
                                                touched.subject
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.subject}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Form.Group controlId="message">
                                        <Form.Label>Message</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="message"
                                            placeholder="Your Message"
                                            value={values.message}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            isInvalid={
                                                !!errors.message &&
                                                touched.message
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={12}>
                                    <Button
                                        type="submit"
                                        id="form-submit"
                                        className="orange-button"
                                        disabled={isSubmitting}
                                    >
                                        Send Message
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    );
};
