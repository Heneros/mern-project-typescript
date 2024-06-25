import { useResetPasswordMutation } from 'features/auth/authApiSlice';
import { Formik } from 'formik';
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { PasswordResetType, PasswordStrength } from 'shared/types';
import {
    strengthColor,
    strengthIndicator,
} from 'shared/utils/password-strength';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEye,
    faEyeSlash,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

export const PasswordReset = () => {
    const initialValues: PasswordResetType = {
        password: '',
        passwordConfirm: '',
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

    const handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    const [resetPassword, { data, isLoading, isSuccess }] =
        useResetPasswordMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate('/login');
            const message = data.message;
            toast.success(message);
        }
    }, [data, isSuccess, navigate]);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
                password: Yup.string().max(255).required('Password required'),
                passwordConfirm: Yup.string(),
            })}
            onSubmit={async (value, { setStatus, setSubmitting }) => {
                try {
                    await resetPassword(value).unwrap();
                    setStatus({ success: true });
                    setSubmitting(false);
                } catch (err) {
                    const message = err?.data.message;
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
                        <Row className="mb-3">
                            <Col className="text-center">
                                {/* <GrPowerReset className="auth-svg" size="2em" /> */}
                                <FontAwesomeIcon
                                    icon={faRotateRight}
                                    size="3x"
                                />
                                <h2>Reset Password?</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="mb-3 text-center">
                            <Col>
                                <p>
                                    Enter your new password to finish the reset
                                    process
                                </p>
                            </Col>
                        </Row>
                        {isLoading ? (
                            <Row className="justify-content-center">
                                <Spinner animation="border" />
                            </Row>
                        ) : (
                            <>
                                <Row className="mb-3">
                                    <Form.Group controlId="password-reset">
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <FormControl
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={values.password}
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    changePassword(
                                                        e.target.value,
                                                    );
                                                }}
                                                placeholder="*****"
                                                isInvalid={
                                                    touched.password &&
                                                    !!errors.password
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
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon
                                                        icon={faEyeSlash}
                                                    />
                                                )}
                                            </Button>
                                            <FormControl.Feedback type="invalid">
                                                {errors.password}
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="mt-2 d-flex align-items-center">
                                        <div
                                            style={{
                                                backgroundColor: level?.color,
                                                width: '350px',
                                                height: '8px',
                                                borderRadius: '7px',
                                            }}
                                        />
                                        <div className="ml-2">
                                            <small>{level?.label}</small>
                                        </div>
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group controlId="password-confirm">
                                        <Form.Label>
                                            Confirm Password
                                        </Form.Label>
                                        <InputGroup>
                                            <FormControl
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={values.passwordConfirm}
                                                name="passwordConfirm"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="******"
                                                isInvalid={
                                                    touched.passwordConfirm &&
                                                    !!errors.passwordConfirm
                                                }
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={
                                                    handleShowHideConfirmPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon
                                                        icon={faEyeSlash}
                                                    />
                                                )}
                                            </Button>

                                            <FormControl.Feedback type="invalid">
                                                {errors.passwordConfirm}
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Button
                                        className="mt-3 mb-2"
                                        type="submit"
                                        variant="success"
                                        size="lg"
                                        disabled={
                                            !values.password &&
                                            !values.passwordConfirm
                                        }
                                    >
                                        Reset Password
                                    </Button>
                                </Row>
                            </>
                        )}
                    </Form>
                </Container>
            )}
        </Formik>
    );
};
