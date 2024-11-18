import React, { useEffect, useState } from 'react';
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
import { Field, FieldArray, Formik, useFormik } from 'formik';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    title: Yup.string().max(50, 'Max 50 characters').required('Title required'),
    category: Yup.string().required('Category required'),
    description: Yup.string(),
    // preview: Yup.string(),
    // bedrooms: Yup.number().required('Empty field'),
    // bathrooms: Yup.number().required('Empty field'),
    // area: Yup.string(),
    // price: Yup.string(),
    // floor: Yup.string().required('Empty field'),
    // parking: Yup.string().required('Empty field'),
    // city: Yup.string().required('Empty field'),
    // country: Yup.string().required('Empty field'),
    questionsAndAnswers: Yup.array().of(
        Yup.object().shape({
            question: Yup.string(),
            answer: Yup.string(),
        }),
    ),
    //   .min(3, 'You must provide at least 3 questions and answers'),
});

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
                            <Formik
                                initialValues={{
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

                                    questionsAndAnswers: [
                                        { question: '', answer: '' },
                                    ],
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async ( values) => {
                                    try {
                                        await createProperty(values).unwrap();
                                    } catch (err: any) {
                                        console.error({ err });
                                        const message =
                                            err.data?.message ||
                                            'Error updating profile';
                                        toast.error(message);
                                    }
                                }}
                            >
                                {({
                                    values,
                                    touched,
                                    errors,
                                    getFieldProps,
                                    isSubmitting,
                                    isValid,
                                    setFieldValue,
                                }) => (
                                    <Form>
                                        <Form.Group controlId="title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="title"
                                                {...getFieldProps('title')}
                                                isInvalid={
                                                    !!(
                                                        touched.title &&
                                                        errors.title
                                                    )
                                                }
                                            />
                                            {touched.title && errors.title && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.title}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group controlId="category">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Category..."
                                                id="category"
                                                {...getFieldProps('category')}
                                                isInvalid={
                                                    !!(
                                                        touched.category &&
                                                        errors.category
                                                    )
                                                }
                                            />
                                            {touched.category &&
                                                errors.category && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.category}
                                                    </Form.Control.Feedback>
                                                )}
                                        </Form.Group>
                                        <Form.Group controlId="description">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                id="description"
                                                placeholder="Leave a description here"
                                                {...getFieldProps(
                                                    'description',
                                                )}
                                                isInvalid={
                                                    !!(
                                                        touched.description &&
                                                        errors.description
                                                    )
                                                }
                                            />
                                            {touched.description &&
                                                errors.description && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.description}
                                                    </Form.Control.Feedback>
                                                )}
                                        </Form.Group>

                                        <Form.Group controlId="bedrooms">
                                            <Form.Label>Bedrooms</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Bedrooms"
                                                id="bedrooms"
                                                {...getFieldProps('bedrooms')}
                                                isInvalid={!!touched.bedrooms}
                                            />

                                            {touched.bedrooms &&
                                                errors.bedrooms && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.bedrooms}
                                                    </Form.Control.Feedback>
                                                )}
                                        </Form.Group>
                                        <Form.Group controlId="bathrooms">
                                            <Form.Label>Bathrooms</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Bathrooms"
                                                id="bathrooms"
                                                {...getFieldProps('bathrooms')}
                                                isInvalid={!!touched.bathrooms}
                                            />

                                            {touched.bathrooms &&
                                                errors.bathrooms && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.bathrooms}
                                                    </Form.Control.Feedback>
                                                )}
                                        </Form.Group>

                                        <Form.Group controlId="city">
                                            <Form.Label>City</Form.Label>

                                            <Form.Control
                                                type="text"
                                                id="city"
                                                placeholder="City..."
                                                {...getFieldProps('city')}
                                                isInvalid={!!touched.city}
                                            />

                                            {touched.city && errors.city && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.city}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group controlId="floor">
                                            <Form.Label>Floor</Form.Label>

                                            <Form.Control
                                                type="text"
                                                id="floor"
                                                placeholder="Floor"
                                                {...getFieldProps('floor')}
                                                isInvalid={!!touched.floor}
                                            />

                                            {touched.floor && errors.floor && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.floor}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group controlId="country">
                                            <Form.Label>Country</Form.Label>

                                            <Form.Control
                                                type="text"
                                                id="country"
                                                placeholder="Country"
                                                {...getFieldProps('country')}
                                                isInvalid={!!touched.country}
                                            />

                                            {touched.country &&
                                                errors.country && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.country}
                                                    </Form.Control.Feedback>
                                                )}
                                        </Form.Group>
                                        <Form.Group controlId="area">
                                            <Form.Label>Area</Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Area"
                                                id="area"
                                                {...getFieldProps('area')}
                                                isInvalid={
                                                    !!(
                                                        touched.area &&
                                                        errors.area
                                                    )
                                                }
                                            />

                                            {touched.area && errors.area && (
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.area}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <FieldArray name="questionsAndAnswers">
                                            {({ push, remove }) => (
                                                <div>
                                                    {values.questionsAndAnswers.map(
                                                        (_, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    marginBottom:
                                                                        '20px',
                                                                }}
                                                            >
                                                                <div>
                                                                    <label>
                                                                        Question:
                                                                    </label>
                                                                    <Field
                                                                        name={`questionsAndAnswers[${index}].question`}
                                                                        placeholder="Enter question"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>
                                                                        Answer:
                                                                    </label>
                                                                    <Field
                                                                        name={`questionsAndAnswers[${index}].answer`}
                                                                        placeholder="Enter answer"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        remove(
                                                                            index,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginLeft:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            push({
                                                                question: '',
                                                                answer: '',
                                                            })
                                                        }
                                                    >
                                                        Add Question
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>
                                        <Form.Group
                                            className="mb-5 mt-3 d d-flex flex-column"
                                            controlId="preview"
                                        >
                                            <Form.Label>
                                                Upload Image
                                            </Form.Label>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    uploadFileHandler(
                                                        e,
                                                        setFieldValue,
                                                    )
                                                }
                                            />
                                            {preview && (
                                                <div className="preview">
                                                    <img
                                                        src={preview}
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
                                                    !isValid ||
                                                    isLoading ||
                                                    isSubmitting
                                                }
                                            >
                                                {isLoading
                                                    ? 'Creating...'
                                                    : 'Create'}
                                            </Button>
                                        </Col>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminCreatePost;
