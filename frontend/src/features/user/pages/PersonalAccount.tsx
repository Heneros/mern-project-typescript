import React, { EventHandler, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';

import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';
import { Formik } from 'formik';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} from '../userApiSlice';
import { useUserRoles } from 'shared/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'shared/ui/Loader';
import { toast } from 'react-toastify';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
});

export const PersonalAccount = () => {
    const { userId } = useUserRoles();
    const [username, setUsername] = useState<string | undefined>('');
    const [email, setEmail] = useState<string | undefined>('');
    const [password, setPassword] = useState<string | undefined>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>(
        '',
    );

    const [firstName, setFirstName] = useState<string | undefined>('');
    const [lastName, setLastName] = useState<string | undefined>('');

    const [avatar, setAvatar] = useState<string | undefined>('');
    const [uploading, setUploading] = useState(false);

    const { data } = useGetUserProfileQuery(undefined);

    const [updateProfile, { data: updateData, isLoading, isSuccess }] =
        useUpdateUserProfileMutation();
    const [sendImage] = useSendImageMutation();

    const navigate = useNavigate();

    useEffect(() => {
        // if (!data?.userProfile && !isLoading) {
        //     navigate('/login');
        // } else {
        const userProfile = data?.userProfile;

        if (userProfile) {
            setUsername(userProfile?.username);
            setEmail(userProfile?.email);
            setFirstName(userProfile?.firstName);
            setLastName(userProfile?.lastName);
            setAvatar(userProfile.avatar);
        }
        // }
    }, [data, navigate, isLoading]);

    // console.log(data?.userProfile);
    useEffect(() => {
        if (isSuccess) {
            const message = updateData?.message;
            toast.success(message);
        }
    }, [updateData, isSuccess, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const userData = {
                firstName,
                lastName,
                username,
                email,
                password,
                passwordConfirm,
                avatar,
            };

            await updateProfile(userData).unwrap();
        } catch (err: any) {
            console.error({ err });
            const message = err.data?.message || 'Error updating profile';
            toast.error(message);
        }
    };
    const uploadFileHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || e.target.files.length === 0) {
            toast.error('No file selected');
            return;
        }
        try {
            const formData = e.target.files[0];
            const res = await sendImage({ formData }).unwrap();
            setAvatar(res.image);
        } catch (error: any) {
            toast.error(error);
        }

        // console.log('uploadFileHandler');
    };

    // console.log(updateData);
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
                                    placeholder="Enter new password"
                                    required
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="passwordConfirm"
                            >
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={(e) =>
                                        setPasswordConfirm(e.target.value)
                                    }
                                    placeholder="Confirm new password"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="uploadImg">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={avatar || ''}
                                    onChange={(e) => setAvatar(e.target.value)}
                                />

                                <label htmlFor="logo">
                                    <Form.Control
                                        accept="image/*"
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        onChange={() => uploadFileHandler}
                                    />
                                    {!uploading ? (
                                        <Button variant="ou">
                                            Choose Your Logo
                                        </Button>
                                    ) : (
                                        <Loader />
                                    )}
                                </label>
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
