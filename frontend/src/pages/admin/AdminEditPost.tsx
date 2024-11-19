import {
    useGetSinglePropertyQuery,
    useUpdatePropertyMutation,
} from 'features/properties/api/propertiesApiSlice';
import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import { useFormik } from 'formik';
import React from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { initialValues } from 'shared/utils/initialValues';
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

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
            } catch (error) {}
        },
    });
    const propertyData = property?.propertyPage ?? [];
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
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminEditPost;
