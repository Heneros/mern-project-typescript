import React from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';

import { useGetAllPropertiesQuery } from 'features/properties/api/propertiesApiSlice';
import { Message } from 'shared/ui/Message';
import { PropertyItem } from 'shared/ui/PropertyItem';
import { PostInfo } from 'shared/types';
import { FilterProperty } from 'features/properties/ui/filterProperty/FilterProperty';
import { PaginationProperties } from 'features/properties/ui/paginationProperties';
import { useAppSelector } from 'shared/lib/store';
import { renderError } from 'shared/utils/renderError';

export function Properties() {
    const { pageNumber = '1' } = useParams();

    const currentPage = Number(pageNumber);
    const { data, isLoading, isError, error } =
        useGetAllPropertiesQuery(currentPage);

    const properties = data && data.properties ? data.properties : [];
    const { selectedCategory } = useAppSelector((state) => state.properties);

    const categories: string[] = Array.from(
        new Set(data?.properties.map((item: PostInfo) => item.category)),
    );

    const filteredProperties = properties.filter((property: PostInfo) => {
        const categoryMatch =
            selectedCategory === null || property.category === selectedCategory;
        return categoryMatch;
    });

    return (
        <>
            <Breadcrumbs nameParent={'Properties'} lastParent={'Properties'} />
            <div className="section properties">
                <Container>
                    <FilterProperty categories={categories} />
                    <div className="row properties-box">
                        {isLoading ? (
                            <Spinner />
                        ) : error ? (
                            <Message variant="danger">
                                {renderError(error)}
                            </Message>
                        ) : (
                            <>
                                {filteredProperties.map((item: PostInfo) => (
                                    <PropertyItem key={item._id} {...item} />
                                ))}
                            </>
                        )}
                    </div>
                    <Row>
                        <Col lg={12}>
                            <PaginationProperties
                                pages={data?.numberOfPages}
                                page={data?.pageNumber}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}
