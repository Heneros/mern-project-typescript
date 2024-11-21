import React, { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { useCreatePropertyMutation } from 'features/properties/api/propertiesApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import { Field, FieldArray, Formik, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { validationSchema } from 'shared/utils/validationSchema';
import { initialValues } from 'shared/utils/initialValues';
import PropertyForm from 'widgets/propertyForm/PropertyForm';

const AdminCreatePost = () => {
    const [createProperty, { isLoading, isSuccess }] =
        useCreatePropertyMutation();
    const [sendImage] = useSendImageMutation();
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Created Property Successfully!');
        }
    }, [isSuccess]);

    const uploadFileHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void,
    ) => {
        if (!e.target.files || e.target.files.length === 0) {
            toast.error('No file selected');
            return;
        }

        try {
            const imageFile = e.target.files[0];
            const res = await sendImage({ imageFile }).unwrap();
            setPreview(res.image);
            setFieldValue('preview', res.image);
        } catch (err: any) {
            if (err.status === 413) {
                toast.error('File is too large. Maximum size is 1MB');
            } else if (err.data?.message) {
                toast.error(err.data.message);
            } else {
                toast.error('Error uploading image');
            }
            console.error('Upload error:', err);
        }
    };

    return (
        <>
            <Breadcrumbs lastParent={'Create Post'} />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>
                    <Col md={9} className="mt-4 mb-2">
                        <Col>
                            <h1 className="text-center">Create Post</h1>
                            <hr />
                            <PropertyForm
                                createProperty={createProperty}
                                isUpdate={false}
                            />
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminCreatePost;
