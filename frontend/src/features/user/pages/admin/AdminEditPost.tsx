/// @ts-ignore
import {
    useGetSinglePropertyQuery,
    useUpdatePropertyMutation,
} from 'features/properties/api/propertiesApiSlice';
// import { useSendImageMutation } from 'features/uploadImage/uploadImage';
// import { Formik, useFormik, FieldArray, Field } from 'formik';
import React, { useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
// import { initialValues as defaultValues } from 'shared/utils/initialValues';
import { renderError } from 'shared/utils/renderError';
import { validationSchema } from 'shared/utils/validationSchema';
import {NavMenu} from 'widgets/navMenu';
import PropertyForm from 'widgets/propertyForm/PropertyForm';

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
    // const [sendImage] = useSendImageMutation();
    const propertyData = property?.propertyPage ?? [];

    useEffect(() => {
        if (isSuccess && updateData?.message) {
            toast.success('Updated property successfully!');
        }
    }, [updateData, isSuccess]);

   // const location = useLocation();

///console.log('location', location);
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
                            // @ts-ignore 
                            <>
        
                <Message>{renderError(error as any) as React.ReactNode}</Message>
                            </>
                             ) : (
                            <>
                                <h3 className="text-center">
                                    Edit Post {propertyData?.title}
                                </h3>
                                <Link to={`/post/${propertyData?._id}`}>
                                    Link on post
                                </Link>
                                <hr />
                                <PropertyForm
                                    propertyData={propertyData}
                                    postId={postId}
                                    updateProperty={updateProperty}
                                    isUpdate={true}
                                />
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminEditPost;
