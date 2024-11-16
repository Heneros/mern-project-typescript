import React, { EventHandler, useEffect, useState } from 'react';

import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';

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
import './PersonalAccount.css';
import { useFormik } from 'formik';
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

    const { data } = useGetUserProfileQuery(undefined);

    const [updateProfile, { data: updateData, isLoading, isSuccess }] =
        useUpdateUserProfileMutation();
    const [sendImage] = useSendImageMutation();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            passwordConfirm: '',
            avatar: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await updateProfile(values).unwrap();
            } catch (err: any) {
                console.error({ err });
                const message = err.data?.message || 'Error updating profile';
                toast.error(message);
            }
        },
    });
    useEffect(() => {
        if (data?.userProfike) {
            const userProfile = data?.userProfile;
            formik.setValues({
                email: userProfile.email || '',
                username: userProfile.username || '',
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                password: '',
                passwordConfirm: '',
                avatar: userProfile.avatar || '',
            });
        }
    }, [data]);

    // console.log(data?.userProfile);
    useEffect(() => {
        if (isSuccess && updateData?.message) {
            // const message = updateData?.message;
            toast.success(updateData?.messag);
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
            const imageFile = e.target.files[0];
            const res = await sendImage({ imageFile }).unwrap();
            // setAvatar(res.image);
            formik.setFieldValue('avatar', res.image);
        } catch (error: any) {
            if (error.status === 413) {
                toast.error('File is too large. Maximum size is 1MB');
            } else if (error.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error('Error uploading image');
            }

            console.error('Upload error:', error);
            // toast.error(error.data.message);
            console.log('Error uploading image', error);
        }
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
                        <Form
                            onSubmit={formik.handleSubmit}
                            className="formPersonal"
                        >
                            <Form.Group controlId="email">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    {...formik.getFieldProps('email')}
                                    isInvalid={
                                        !!(
                                            formik.touched.email &&
                                            formik.errors.email
                                        )
                                    }
                                />
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.email}
                                        </Form.Control.Feedback>
                                    )}
                            </Form.Group>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...formik.getFieldProps('username')}
                                    isInvalid={
                                        !!(
                                            formik.touched.username &&
                                            formik.errors.username
                                        )
                                    }
                                />
                                {formik.touched.username &&
                                    formik.errors.username && (
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.username}
                                        </Form.Control.Feedback>
                                    )}
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...formik.getFieldProps('password')}
                                    isInvalid={
                                        !!(
                                            formik.touched.password &&
                                            formik.errors.password
                                        )
                                    }
                                />
                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.password}
                                        </Form.Control.Feedback>
                                    )}
                            </Form.Group>

                            <Form.Group controlId="passwordConfirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...formik.getFieldProps('passwordConfirm')}
                                    isInvalid={
                                        !!(
                                            formik.touched.passwordConfirm &&
                                            formik.errors.passwordConfirm
                                        )
                                    }
                                />
                                {formik.touched.passwordConfirm &&
                                    formik.errors.passwordConfirm && (
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.passwordConfirm}
                                        </Form.Control.Feedback>
                                    )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="uploadImg">
                                <Form.Label>Avatar</Form.Label>
                                <label htmlFor="logo">
                                    <Form.Control
                                        accept="image/*"
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        onChange={uploadFileHandler}
                                    />
                                    {formik.values.avatar && (
                                        <div className="preview">
                                            <img
                                                src={formik.values.avatar}
                                                alt="Preview"
                                                className="preview-img"
                                            />
                                        </div>
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
                                disabled={
                                    !formik.isValid ||
                                    isLoading ||
                                    formik.isSubmitting
                                }
                            >
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
