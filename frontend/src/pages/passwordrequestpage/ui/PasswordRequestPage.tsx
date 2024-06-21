import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { usePasswordResetRequestMutation } from 'features/auth/authApiSlice';
import { toast } from 'react-toastify';
// import { GoMailRead } from 'react-icons/go';
import {
    Container,
    Form,
    Button,
    Row,
    Col,
    Spinner,
    InputGroup,
    FormControl,
} from 'react-bootstrap';
import { FormLogin } from 'shared/ui/FormLogin';

export const PasswordRequestPage = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const [passwordResetRequest, { data, isLoading, isSuccess }] =
        usePasswordResetRequestMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data.message;
            toast.success(message);
        }
    }, [data, isSuccess, navigate]);

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
            })}
            onSubmit={async (value, { setStatus, setSubmitting }) => {
                try {
                    await passwordResetRequest(value).unwrap();
                    setStatus({ success: true });
                    setSubmitting(false);
                } catch (err) {
                    // const message = err?.data?.message;
                    toast.error('Error msg');
                    setStatus({ success: false });
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
                <Container
                    className="p-4"
                    style={{
                        border: '2px solid #e4e5e7',
                        borderRadius: '25px',
                        maxWidth: '600px',
                    }}
                >
                    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {/* <GoMailRead
                                        className="auth-svg"
                                        size="2em"
                                    /> */}
                                    <h2>Enter Your Email</h2>
                                </div>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <div className="d-flex justify-content-center align-items-center">
                                    <p>
                                        Are you sure you want to reset your
                                        password?
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        {isLoading ? (
                            <Row className="justify-content-center">
                                <Spinner animation="border" />
                            </Row>
                        ) : (
                            <>
                                <Row className="mb-3">
                                    <Form.Group controlId="email-signup">
                                        <Form.Label>Email Address*</Form.Label>
                                        <InputGroup>
                                            <FormControl
                                                type="email"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="email@example.com"
                                                isInvalid={
                                                    touched.email &&
                                                    !!errors.email
                                                }
                                            />
                                            <FormControl.Feedback type="invalid">
                                                {errors.email}
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                {/* button */}
                                <Row className="mb-3">
                                    <Col>
                                        <Button
                                            className="mt-3 mb-2"
                                            type="submit"
                                            variant="success"
                                            size="lg"
                                            disabled={!values.email}
                                        >
                                            Send Password Reset Email
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button
                                            variant="warning"
                                            size="lg"
                                            onClick={goBack}
                                        >
                                            Go Back
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Form>
                </Container>
            )}
        </Formik>
    );
};
