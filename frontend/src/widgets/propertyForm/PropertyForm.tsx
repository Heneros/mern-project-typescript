import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import { initialValues as defaultValues } from 'shared/utils/initialValues';
import SimpleMDE from 'react-simplemde-editor';
import { useGetSinglePropertyQuery } from 'features/properties/api/propertiesApiSlice';
import { validationSchema } from 'shared/utils/validationSchema';

interface PropertyFormProps {
    propertyData?: string[];
    initialValues: {
        title: string;
        description: string;
        bedrooms: string;
        bathrooms: string;
        country: string;
        questionsAndAnswers: Array<{ question: string; answer: string }>;
    };
    onSubmit: (values: any) => void;
    validationSchema: any;
    isLoading: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
    propertyData,
    initialValues,
    onSubmit,
    isLoadingUpdate,
}) => {
    return (
        <Formik
            enableReinitialize
            initialValues={
                propertyData
                    ? { ...defaultValues, ...propertyData }
                    : defaultValues
            }
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                    await updateProperty({
                        id: postId,
                        ...values,
                    }).unwrap();
                } catch (error) {}
            }}
        ></Formik>
    );
};
