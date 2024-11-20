import {
    useGetSinglePropertyQuery,
    useUpdatePropertyMutation,
} from 'features/properties/api/propertiesApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import { Formik, useFormik, FieldArray, Field } from 'formik';
import React, { useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import {
    initialValues as defaultValues,
    initialValues,
} from 'shared/utils/initialValues';
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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: propertyData
            ? { ...defaultValues, ...propertyData }
            : defaultValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                // const formattedValues = {
                //     ...values,
                //     bedrooms: Number(values.bedrooms),
                //     bathrooms: Number(values.bathrooms),
                //     floor: Number(values.floor),
                //     price: Number(values.price),
                //     parking: Number(values.parking),
                // };

                // toast.success('Updated property successfully!');
                // const result = await updateProperty({ values }).unwrap();

                // if (result) {
                //     toast.success('Property updated successfully!');
                // }
                // console.log(result);
                await updateProperty({
                    id: postId,
                    ...values,
                }).unwrap();
            } catch (error) {
                console.error('Update failed', error);
                toast.error('Failed to update property');
            }
        },
    });

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
                                                                    question:
                                                                        '',
                                                                    answer: '',
                                                                })
                                                            }
                                                        >
                                                            Add Question
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                            <Button
                                                variant="primary"
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
