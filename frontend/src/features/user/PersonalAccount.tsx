import React, { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { useGetUserProfileQuery } from './userApiSlice';
import { useUserRoles } from 'shared/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'shared/ui/Loader';

export const PersonalAccount = () => {
    const { isAdmin, isEditor, userId } = useUserRoles();
    const [username, setUsername] = useState<string | undefined>('');
    const [email, setEmail] = useState<string | undefined>('');
    const [password, setPassword] = useState<string | undefined>('');
    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(
        '',
    );
    const {
        data: dataProfile,
        error,
        isLoading,
    } = useGetUserProfileQuery(userId);

    const navigate = useNavigate();
    console.log(dataProfile);
    useEffect(() => {
        if (!dataProfile && !isLoading) {
            navigate('/login');
        } else {
            setUsername(dataProfile?.username);
            setEmail(dataProfile?.email);
        }
    }, [dataProfile, navigate, isLoading]);

    const handleSubmit = () => {};
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
                        <h2>Personal Account</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={dataProfile?.email}
                                    placeholder="Email Address"
                                    // onChange={handleChange}
                                    // required
                                    // isInvalid={
                                    //     !validator.isEmail(dataProfile.email)
                                    // }
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                    Please provide a valid email.
                                </Form.Control.Feedback> */}
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
