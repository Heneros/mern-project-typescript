import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} from '../userApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import './PersonalAccount.css';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    currentPassword: Yup.string().required(
        'Current password is required to make changes',
    ),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .when('password', {
            is: (val: string) => val && val.length > 0,
            then: (schema) =>
                schema.required("Password confirmation is required'"),
        }),
    avatar: Yup.string(),
});

export const PersonalAccount = () => {
    const { data } = useGetUserProfileQuery(undefined);
    const [updateProfile, { data: updateData, isLoading, isSuccess }] =
        useUpdateUserProfileMutation();
    const [sendImage] = useSendImageMutation();

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            currentPassword: '',
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
        if (data?.userProfile) {
            const userProfile = data.userProfile;
            formik.setValues({
                email: userProfile.email || '',
                username: userProfile.username || '',
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                currentPassword: '',
                password: '',
                passwordConfirm: '',
                avatar: userProfile.avatar || '',
            });
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess && updateData?.message) {
            toast.success(updateData.message);
        }
    }, [updateData, isSuccess]);

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
        }
    };

    return (
        <>
            <Breadcrumbs />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>
                    <Col md={9} className="mt-4 mb-2">
                        <Col className="d-flex align-items-center flex-column">
                            <h2>Personal Account</h2>
                            <p>
                                Before updating your profile, please enter your
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
                            <Form.Group
                                controlId="currentPassword"
                                className="mb-4"
                            >
                                <Form.Label>Current Password *</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...formik.getFieldProps('currentPassword')}
                                    isInvalid={
                                        !!(
                                            formik.touched.currentPassword &&
                                            formik.errors.currentPassword
                                        )
                                    }
                                />
                                {formik.touched.currentPassword &&
                                    formik.errors.currentPassword && (
                                        <>
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.currentPassword}
                                            </Form.Control.Feedback>
                                        </>
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

                            <Form.Group
                                className="mb-5 mt-3 d d-flex flex-column"
                                controlId="uploadImg"
                            >
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
