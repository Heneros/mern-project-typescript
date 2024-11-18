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
import { FieldArray, useFormik } from 'formik';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    title: Yup.string().max(50, 'Max 50 characters').required('Title required'),
    category: Yup.string().required('Category required'),
    preview: Yup.string(),
    bedrooms: Yup.number().required('Empty fild'),
    bathrooms: Yup.number().required('Empty field'),
    area: Yup.number(),
    price: Yup.number(),
    floor: Yup.number().required('Empty field'),
    parking: Yup.number().required('Empty field'),
    city: Yup.string().required('Empty field'),
    country: Yup.string().required('Empty field'),
    questionsAndAnswers: Yup.array()
        .of(
            Yup.object().shape({
                question: Yup.string().required('Question is required'),
                answer: Yup.string().required('Answer is required'),
            }),
        )
        .min(3, 'You must provide at least 3 questions and answers'),
});

const AdminCreatePost = () => {
    const [createProperty, { isLoading, isSuccess }] =
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
            questionsAndAnswers: [{ question: '', answer: '' }],
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
                        <Col>
                            <h1 className="text-center">Create Post</h1>
                            <hr />

                            <Form onSubmit={formik.handleSubmit}>
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="title"
                                        {...formik.getFieldProps('title')}
                                        isInvalid={
                                            !!(
                                                formik.touched.title &&
                                                formik.errors.title
                                            )
                                        }
                                    />
                                    {formik.touched.title &&
                                        formik.errors.title && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.title}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Category..."
                                        id="category"
                                        {...formik.getFieldProps('category')}
                                        isInvalid={!!formik.touched.category}
                                    />
                                    {formik.touched.category &&
                                        formik.errors.category && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.category}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        id="description"
                                        placeholder="Leave a description here"
                                        {...formik.getFieldProps('description')}
                                        isInvalid={!!formik.touched.description}
                                    />
                                    {formik.touched.description &&
                                        formik.errors.description && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.description}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>

                                <Form.Group controlId="bedrooms">
                                    <Form.Label>Bedrooms</Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Bedrooms"
                                        id="bedrooms"
                                        {...formik.getFieldProps('bedrooms')}
                                        isInvalid={!!formik.touched.bedrooms}
                                    />

                                    {formik.touched.bedrooms &&
                                        formik.errors.bedrooms && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.bedrooms}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="bathrooms">
                                    <Form.Label>Bathrooms</Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Bathrooms"
                                        id="bathrooms"
                                        {...formik.getFieldProps('bathrooms')}
                                        isInvalid={!!formik.touched.bathrooms}
                                    />

                                    {formik.touched.bathrooms &&
                                        formik.errors.bathrooms && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.bathrooms}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>

                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>

                                    <Form.Control
                                        type="text"
                                        id="city"
                                        placeholder="City..."
                                        {...formik.getFieldProps('city')}
                                        isInvalid={!!formik.touched.city}
                                    />

                                    {formik.touched.city &&
                                        formik.errors.city && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.city}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="floor">
                                    <Form.Label>Floor</Form.Label>

                                    <Form.Control
                                        type="text"
                                        id="floor"
                                        placeholder="Floor"
                                        {...formik.getFieldProps('floor')}
                                        isInvalid={!!formik.touched.floor}
                                    />

                                    {formik.touched.floor &&
                                        formik.errors.floor && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.floor}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="country">
                                    <Form.Label>Country</Form.Label>

                                    <Form.Control
                                        type="text"
                                        id="country"
                                        placeholder="Country"
                                        {...formik.getFieldProps('country')}
                                        isInvalid={!!formik.touched.country}
                                    />

                                    {formik.touched.country &&
                                        formik.errors.country && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.country}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="area">
                                    <Form.Label>Area</Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Area"
                                        id="area"
                                        {...formik.getFieldProps('area')}
                                        isInvalid={!!formik.touched.area}
                                    />

                                    {formik.touched.area &&
                                        formik.errors.area && (
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.area}
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <FieldArray name="questionsAndAnswers">
                                    {({ push, remove }) => (
                                        <>
                                            {formik.values.questionsAndAnswers.map(
                                                (_, index) => (
                                                    <Form.Group
                                                        className="mb-5 mt-3 d d-flex flex-column"
                                                        controlId="preview"
                                                        key={index}
                                                    >
                                                        <Form.Label>
                                                            Question {index + 1}
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Question"
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                            onBlur={
                                                                formik.handleBlur
                                                            }
                                                            name={`questionsAndAnswers.${index}.question`}
                                                            isInvalid={
                                                                !!formik.touched
                                                                    .questionsAndAnswers?.[
                                                                    index
                                                                ]?.question &&
                                                                typeof formik
                                                                    .errors
                                                                    .questionsAndAnswers?.[
                                                                    index
                                                                ] ===
                                                                    'object' &&
                                                                !!formik.errors
                                                                    .questionsAndAnswers?.[
                                                                    index
                                                                ]?.question
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {typeof formik
                                                                .errors
                                                                .questionsAndAnswers?.[
                                                                index
                                                            ] === 'object' &&
                                                                formik.errors
                                                                    .questionsAndAnswers?.[
                                                                    index
                                                                ]?.question}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                ),
                                            )}
                                        </>
                                    )}
                                </FieldArray>
                                <Form.Group
                                    className="mb-5 mt-3 d d-flex flex-column"
                                    controlId="preview"
                                >
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control
                                        accept="image/*"
                                        id="preview"
                                        type="file"
                                        onChange={uploadFileHandler}
                                    />
                                    {formik.values.preview && (
                                        <div className="preview">
                                            <img
                                                src={formik.values.preview}
                                                alt="Preview"
                                                className="preview-img"
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                                <Col className="d-grid gap-2">
                                    <Button
                                        variant="success"
                                        className="my-2 "
                                        size="lg"
                                        type="submit"
                                        disabled={
                                            !formik.isValid ||
                                            isLoading ||
                                            formik.isSubmitting
                                        }
                                    >
                                        {isLoading ? 'Creating...' : 'Create'}
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminCreatePost;
