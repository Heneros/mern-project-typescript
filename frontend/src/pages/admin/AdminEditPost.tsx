import {
    useGetSinglePropertyQuery,
    useUpdatePropertyMutation,
} from 'features/properties/api/propertiesApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import { Formik, useFormik, FieldArray, Field } from 'formik';
import React, { useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/message';
import { initialValues as defaultValues } from 'shared/utils/initialValues';
import { renderError } from 'shared/utils/renderError';
import { validationSchema } from 'shared/utils/validationSchema';
import NavMenu from 'widgets/navMenu/ui/NavMenu';

const AdminEditPost = () => {
    const { id: postId } = useParams();
    const {
        data: property,
        isLoading,
        error,
        refetch,
    } = useGetSinglePropertyQuery(postId);

    const [
        updateProperty,
        { data: updateData, isLoading: isLoadingUpdate, isSuccess },
    ] = useUpdatePropertyMutation();
    const [sendImage] = useSendImageMutation();
    const propertyData = property?.propertyPage ?? [];

    // const formik = useFormik({
    //     enableReinitialize: true,
    //     initialValues: propertyData
    //         ? { ...defaultValues, ...propertyData }
    //         : defaultValues,
    //     validationSchema: validationSchema,
    //     onSubmit: async (values) => {
    //         try {
    //             // const formattedValues = {
    //             //     ...values,
    //             //     bedrooms: Number(values.bedrooms),
    //             //     bathrooms: Number(values.bathrooms),
    //             //     floor: Number(values.floor),
    //             //     price: Number(values.price),
    //             //     parking: Number(values.parking),
    //             // };

    //             // toast.success('Updated property successfully!');
    //             // const result = await updateProperty({ values }).unwrap();

    //             // if (result) {
    //             //     toast.success('Property updated successfully!');
    //             // }
    //             // console.log(result);
    //             await updateProperty({
    //                 id: postId,
    //                 ...values,
    //             }).unwrap();
    //         } catch (error) {
    //             console.error('Update failed', error);
    //             toast.error('Failed to update property');
    //         }
    //     },
    // });

    useEffect(() => {
        if (isSuccess && updateData?.message) {
            toast.success('Updated property successfully!');
        }
    }, [updateData, isSuccess]);

    // console.log('data', propertyData);
    // console.log('property', property);
    return (
        <>
            <Breadcrumbs nameParent="Edit Post" lastParent="Posts" />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>
                    <Col md={9} className="mt-4 mb-2">
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message>{renderError(error)}</Message>
                        ) : (
                            <>
                                <h3 className="text-center">
                                    Edit Post {propertyData?.title}
                                </h3>
                                <hr />
                                <Formik
                                    enableReinitialize
                                    initialValues={
                                        propertyData
                                            ? {
                                                  ...defaultValues,
                                                  ...propertyData,
                                              }
                                            : defaultValues
                                    }
                                    validationSchema={validationSchema}
                                    onSubmit={async (
                                        values,
                                        { setSubmitting, setStatus },
                                    ) => {
                                        try {
                                            await updateProperty({
                                                id: postId,
                                                ...values,
                                            }).unwrap();
                                            toast.success(
                                                'Property updated successfully!',
                                            );
                                            setStatus({ success: true });
                                            setSubmitting(false);
                                        } catch (error) {
                                            console.error(
                                                'Update failed',
                                                error,
                                            );
                                            toast.error(
                                                'Failed to update property',
                                            );
                                            setStatus({
                                                success: false,
                                            });
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({
                                        values,
                                        touched,
                                        errors,
                                        handleChange,
                                        isSubmitting,
                                        isValid,
                                        handleSubmit,
                                        setFieldValue,
                                    }) => (
                                        <Form
                                            noValidate
                                            autoComplete="off"
                                            onSubmit={handleSubmit}
                                        >
                                            <Form.Group controlId="title">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={values.title}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        !!(
                                                            touched.title &&
                                                            errors.title
                                                        )
                                                    }
                                                />
                                                {touched.title &&
                                                    typeof errors.title ===
                                                        'string' && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.title}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <Form.Group controlId="description">
                                                <Form.Label>
                                                    Description
                                                </Form.Label>
                                                <SimpleMDE
                                                    value={values.description}
                                                    id="description"
                                                    placeholder="Leave a description here"
                                                    onChange={(value) =>
                                                        setFieldValue(
                                                            'description',
                                                            value,
                                                        )
                                                    }
                                                />
                                                <Form.Control
                                                    as="textarea"
                                                    id="description"
                                                    placeholder="Leave a description here"
                                                    onChange={handleChange}
                                                    value={values.description}
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
                                                <Form.Label>
                                                    Bedrooms
                                                </Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    placeholder="Bedrooms"
                                                    id="bedrooms"
                                                    value={values.bedrooms}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        !!(
                                                            errors.bedrooms &&
                                                            touched.bedrooms
                                                        )
                                                    }
                                                />

                                                {touched.bedrooms &&
                                                    errors.bedrooms && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.bedrooms}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <Form.Group controlId="bathrooms">
                                                <Form.Label>
                                                    Bathrooms
                                                </Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    placeholder="Bathrooms"
                                                    id="bathrooms"
                                                    onChange={handleChange}
                                                    value={values.bathrooms}
                                                    isInvalid={
                                                        !!(
                                                            errors.bathrooms &&
                                                            touched.bathrooms
                                                        )
                                                    }
                                                />

                                                {touched.bathrooms &&
                                                    errors.bathrooms && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.bathrooms}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <Form.Group controlId="country">
                                                <Form.Label>Country</Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    id="country"
                                                    placeholder="Country"
                                                    value={values.country}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        !!(
                                                            touched.country &&
                                                            errors.country
                                                        )
                                                    }
                                                />

                                                {touched.country &&
                                                    errors.country && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.country}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <Form.Group controlId="city">
                                                <Form.Label>City</Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    id="city"
                                                    placeholder="City..."
                                                    onChange={handleChange}
                                                    value={values.city}
                                                    isInvalid={
                                                        !!(
                                                            touched.city &&
                                                            errors.city
                                                        )
                                                    }
                                                />

                                                {touched.city &&
                                                    errors.city && (
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
                                                    onChange={handleChange}
                                                    value={values.floor}
                                                    isInvalid={
                                                        !!(
                                                            touched.floor &&
                                                            errors.floor
                                                        )
                                                    }
                                                />

                                                {touched.floor &&
                                                    errors.floor && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.floor}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>

                                            <Form.Group controlId="price">
                                                <Form.Label>Price</Form.Label>

                                                <Form.Control
                                                    type="number"
                                                    id="price"
                                                    placeholder="Price"
                                                    value={values.price}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        !!(
                                                            touched.price &&
                                                            errors.price
                                                        )
                                                    }
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
                                                    onChange={handleChange}
                                                    // {...getFieldProps('area')}
                                                    value={values.area}
                                                    isInvalid={
                                                        !!(
                                                            touched.area &&
                                                            errors.area
                                                        )
                                                    }
                                                />

                                                {touched.area &&
                                                    errors.area && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.area}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <Form.Group controlId="parking">
                                                <Form.Label>Parking</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    id="parking"
                                                    placeholder="Parking"
                                                    value={values.parking}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        !!(
                                                            touched.parking &&
                                                            errors.parking
                                                        )
                                                    }
                                                />
                                                {touched.parking &&
                                                    errors.parking && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.parking}
                                                        </Form.Control.Feedback>
                                                    )}
                                            </Form.Group>
                                            <FieldArray name="questionsAndAnswers">
                                                {({ push, remove }) => (
                                                    <>
                                                        {values.questionsAndAnswers.map(
                                                            (
                                                                _: any,
                                                                index: any,
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="my-4"
                                                                >
                                                                    <Form.Group
                                                                        controlId={`questionsAndAnswers[${index}].question`}
                                                                    >
                                                                        <Form.Label>
                                                                            Question:
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            id="question"
                                                                            name={`questionsAndAnswers[${index}].question`}
                                                                            placeholder="Enter question"
                                                                        />
                                                                    </Form.Group>
                                                                    <Form.Group
                                                                        controlId={`questionsAndAnswers[${index}].answer`}
                                                                        className="mt-3"
                                                                    >
                                                                        <Form.Label>
                                                                            Answer:
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            name={`questionsAndAnswers[${index}].answer`}
                                                                            placeholder="Enter answer"
                                                                        />
                                                                    </Form.Group>
                                                                    <Button
                                                                        type="button"
                                                                        variant="danger"
                                                                        onClick={() =>
                                                                            remove(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="mt-3"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <Row>
                                                            <Col>
                                                                <Button
                                                                    type="button"
                                                                    variant="primary"
                                                                    className="mb-4"
                                                                    onClick={() =>
                                                                        push({
                                                                            question:
                                                                                '',
                                                                            answer: '',
                                                                        })
                                                                    }
                                                                >
                                                                    Add Question
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </FieldArray>
                                            <Button
                                                variant="success"
                                                type="submit"
                                                className="mt-3"
                                                disabled={isLoadingUpdate}
                                            >
                                                {isLoadingUpdate
                                                    ? 'Updating...'
                                                    : 'Update Property'}
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminEditPost;
