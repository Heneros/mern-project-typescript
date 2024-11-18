import React, { useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import * as Yup from 'yup';
import {
    Button,
    Col,
    Container,
    Form,
    Row,
    Spinner,
    Table,
} from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { useCreatePropertyMutation } from 'features/properties/api/propertiesApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    title: Yup.string().max(50, 'Max 50 characters').required('Title required'),
    category: Yup.string().required('Title required'),
    preview: Yup.string(),
    bedrooms: Yup.number(),
    bathrooms: Yup.number(),
    area: Yup.number(),
    price: Yup.number(),
    floor: Yup.number(),
    parking: Yup.number(),
    city: Yup.string(),
    country: Yup.string(),
});

const AdminCreatePost = () => {
    const [createProperty, { isLoading: loadingCreate, isSuccess }] =
        useCreatePropertyMutation();
    const [sendImage] = useSendImageMutation();

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            category: '',
            preview: '',
            bedrooms: '',
            bathrooms: '',
            city: '',
            country: '',
            area: '',
            price: '',
            floor: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await createProperty(values).unwrap();
            } catch (err: any) {
                console.error({ err });
                const message = err.data?.message || 'Error updating profile';
                toast.error(message);
            }
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success('Created Property Successfully!');
        }
    }, [isSuccess]);

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
            formik.setFieldValue('preview', res.image);
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
                        <Col className="d-flex align-items-center flex-column">
                            <Form onSubmit={formik.handleSubmit}>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...formik.getFieldProps('title')}
                                        isInvalid={!!formik.touched.title}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminCreatePost;
