import React, { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
// import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
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

    useEffect(() => {
        if (isSuccess) {
            toast.success('Created Property Successfully!');
        }
    }, [isSuccess]);

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
