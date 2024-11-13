import React, { EventHandler, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';
import { Formik } from 'formik';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} from './userApiSlice';
import { useUserRoles } from 'shared/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'shared/ui/Loader';
import { toast } from 'react-toastify';
import { SignUpType } from 'shared/types';

export const PersonalAccount = () => {
    const initialValues: SignUpType = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        submit: null,
    };
    const { userId } = useUserRoles();
    const [username, setUsername] = useState<string | undefined>('');
    const [email, setEmail] = useState<string | undefined>('');
    const [password, setPassword] = useState<string | undefined>('');
    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(
        '',
    );
    const [firstName, setFirstName] = useState<string | undefined>('');
    const [lastName, setLastName] = useState<string | undefined>('');

    const {
        data: dataProfile,
        error,
        isLoading,
    } = useGetUserProfileQuery(userId);
    const [updateProfile] = useUpdateUserProfileMutation();

    const navigate = useNavigate();
    // console.log(dataProfile);
    useEffect(() => {
        if (!dataProfile && !isLoading) {
            navigate('/login');
        } else {
            setUsername(dataProfile?.username);
            setEmail(dataProfile?.email);
            setFirstName(dataProfile?.firstName);
            setLastName(dataProfile?.lastName);
        }
    }, [dataProfile, navigate, isLoading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            try {
                await updateProfile({
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                }).unwrap();
                console.log('Updated');
            } catch (err: unknown) {
                const message = (err as any).error;
                toast.error(message);
                //   const { data } = error;
                //   toast.error('Error');
            }
        }
    };
    // console.log(userId);
    return (
        <>
            <Breadcrumbs />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>

                    <Col md={9} className="mt-4 mb-2">
                        <Col className="d-flex  align-items-center  flex-column">
                            <h2>Personal Account</h2>
                            <p>
                                Before update your profile, please enter your
                                current password.
                            </p>
                        </Col>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email"
                                />
                            </Form.Group>
                            <Form.Group controlId="username">
                                <Form.Label>UserName</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Username"
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter current password"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm Password"
                                    required
                                />
                            </Form.Group>

                            <p>
                                Before update please enter valid password please
                            </p>
                            <Button
                                variant="primary"
                                type="submit"
                                className="mt-3"
                            >
                                Update Profile
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
