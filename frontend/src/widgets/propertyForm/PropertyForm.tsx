import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import { initialValues as defaultValues } from 'shared/utils/initialValues';
import SimpleMDE from 'react-simplemde-editor';
import { validationSchema } from 'shared/utils/validationSchema';
import { toast } from 'react-toastify';
import useImageUpload from 'widgets/uploadImg/useImageUpload';

interface PropertyFormProps {
    propertyData?: string[];
    createProperty?: (data: { values: any }) => { unwrap: () => Promise<any> };
    updateProperty?: (data: { id: string; [key: string]: any }) => {
        unwrap: () => Promise<any>;
    };
    // onSubmit: (values: any) => void;
    validationSchema?: any;
    isLoading?: boolean;
    isUpdate: boolean;
    postId: string | undefined;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
    propertyData,
    createProperty,
    updateProperty,
    isUpdate = false,
    postId,
}) => {
    const { uploadFileHandler, preview, setPreview } = useImageUpload();

    return (
        <Formik
            enableReinitialize
            initialValues={
                propertyData
                    ? { ...defaultValues, ...propertyData }
                    : defaultValues
            }
            validationSchema={validationSchema}
            onSubmit={async (
                values,
                { setSubmitting, setStatus, resetForm },
            ) => {
                try {
                    if (isUpdate && updateProperty && postId) {
                        await updateProperty({
                            id: postId,
                            ...values,
                        }).unwrap();
                        setStatus({ success: true });
                        setSubmitting(false);
                    } else if (createProperty) {
                        await createProperty({ values }).unwrap();
                        resetForm({
                            values: {
                                title: '',
                                description: '',
                                category: '',
                                preview: '',
                                bedrooms: 0,
                                bathrooms: 0,
                                city: '',
                                country: '',
                                area: 0,
                                floor: 0,
                                price: 0,
                                parking: 0,
                                questionsAndAnswers: [
                                    {
                                        question: '',
                                        answer: '',
                                    },
                                ],
                            },
                        });
                        setStatus({ success: true });
                        setSubmitting(false);
                    } else {
                    }
                } catch (err: any) {
                    console.error({ err });
                    const message =
                        err.data?.message || 'Error updating profile';
                    toast.error(message);
                    setStatus({ success: false });
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
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            id="title"
                            placeholder="Title"
                            value={values.title}
                            onChange={handleChange}
                            isInvalid={!!(touched.title && errors.title)}
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
                            value={values.category}
                            onChange={handleChange}
                            isInvalid={!!(touched.category && errors.category)}
                        />
                        {touched.category && errors.category && (
                            <Form.Control.Feedback type="invalid">
                                {errors.category}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <SimpleMDE
                            value={values.description}
                            id="description"
                            placeholder="Leave a description here"
                            onChange={(value) =>
                                setFieldValue('description', value)
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="bedrooms">
                        <Form.Label>Bedrooms</Form.Label>

                        <Form.Control
                            type="text"
                            placeholder="Bedrooms"
                            id="bedrooms"
                            value={values.bedrooms}
                            onChange={handleChange}
                            isInvalid={!!(errors.bedrooms && touched.bedrooms)}
                        />

                        {touched.bedrooms && errors.bedrooms && (
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
                            onChange={handleChange}
                            value={values.bathrooms}
                            isInvalid={
                                !!(errors.bathrooms && touched.bathrooms)
                            }
                        />

                        {touched.bathrooms && errors.bathrooms && (
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
                            isInvalid={!!(touched.country && errors.country)}
                        />

                        {touched.country && errors.country && (
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
                            isInvalid={!!(touched.city && errors.city)}
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
                            onChange={handleChange}
                            value={values.floor}
                            isInvalid={!!(touched.floor && errors.floor)}
                        />

                        {touched.floor && errors.floor && (
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
                            isInvalid={!!(touched.price && errors.price)}
                        />

                        {touched.country && errors.country && (
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
                            isInvalid={!!(touched.area && errors.area)}
                        />

                        {touched.area && errors.area && (
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
                            isInvalid={!!(touched.parking && errors.parking)}
                        />
                        {touched.parking && errors.parking && (
                            <Form.Control.Feedback type="invalid">
                                {errors.parking}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            type="file"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => uploadFileHandler(e, setFieldValue)}
                        />
                        {(preview || values.preview) && (
                            <img
                                src={preview || values.preview}
                                alt="preview"
                                style={{ maxWidth: '200px', marginTop: '10px' }}
                            />
                        )}
                    </Form.Group>
                    <FieldArray name="questionsAndAnswers">
                        {({ push, remove }) => (
                            <>
                                {values.questionsAndAnswers.map((qa, index) => (
                                    <div key={index} className="my-4">
                                        <Form.Group
                                            controlId={`questionsAndAnswers[${index}].question`}
                                        >
                                            <Form.Label>Question:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`questionsAndAnswers[${index}].question`}
                                                placeholder="Enter question"
                                                value={qa.question}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched.questionsAndAnswers &&
                                                    touched.questionsAndAnswers[
                                                        index
                                                    ]?.question &&
                                                    errors.questionsAndAnswers &&
                                                    errors.questionsAndAnswers[
                                                        index
                                                    ]?.question
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.questionsAndAnswers &&
                                                    errors.questionsAndAnswers[
                                                        index
                                                    ]?.question}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group
                                            controlId={`questionsAndAnswers[${index}].answer`}
                                            className="mt-3"
                                        >
                                            <Form.Label>Answer:</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name={`questionsAndAnswers[${index}].answer`}
                                                placeholder="Enter answer"
                                                value={qa.answer}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched.questionsAndAnswers &&
                                                    touched.questionsAndAnswers[
                                                        index
                                                    ]?.answer &&
                                                    errors.questionsAndAnswers &&
                                                    errors.questionsAndAnswers[
                                                        index
                                                    ]?.answer
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.questionsAndAnswers &&
                                                    errors.questionsAndAnswers[
                                                        index
                                                    ]?.answer}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => remove(index)}
                                            className="mt-3"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Row>
                                    <Col>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            className="mb-4"
                                            onClick={() =>
                                                push({
                                                    question: '',
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
                    <Col className="d-grid gap-2">
                        <Button
                            variant="success"
                            className="my-2 "
                            size="lg"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            {isUpdate ? 'Update' : 'Create'}
                        </Button>
                    </Col>
                </Form>
            )}
        </Formik>
    );
};

export default PropertyForm;
