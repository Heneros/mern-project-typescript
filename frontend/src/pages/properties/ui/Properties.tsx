import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Spinner } from 'react-bootstrap';
import { Message } from 'shared/ui/Message';
import { PropertyItem } from 'widgets/PropertyItem';
import { PostInfo } from 'shared/types';
import { FilterProperty } from 'widgets/FilterProperty';
import { Link, useParams } from 'react-router-dom';
import { PaginationProperties } from 'widgets/PaginationProperties';
import { useAppSelector } from 'shared/lib/store';

export function Properties() {
    const { pageNumber = '1' } = useParams();

    console.log('pageNumber', pageNumber);
    const currentPage = Number(pageNumber);
    const { data, isLoading, isError, error } =
        useGetAllPropertiesQuery(currentPage);

    const properties = data && data.properties ? data.properties : [];
    const { selectedCategory } = useAppSelector((state) => state.properties);

    // const [activeFilter, setActiveFilter] = useState<string>('all');

    // const handleFilterChange = (filter: string) => {
    //     setActiveFilter(filter);
    // };

    if (isLoading) {
        return 'Loading...';
    }

    const categories: string[] = Array.from(
        new Set(data?.properties.map((item: PostInfo) => item.category)),
    );

    const filteredProperties = properties.filter((property: PostInfo) => {
        const categoryMatch =
            selectedCategory === null || property.category === selectedCategory;
        return categoryMatch;
    });

    // const filteredProperties =
    //     activeFilter === 'all'
    //         ? data.properties
    //         : data?.properties.filter(
    //               (item: PostInfo) => item.category === activeFilter,
    //           );

    console.log(filteredProperties);

    return (
        <>
            <Breadcrumbs />
            <div className="section properties">
                <div className="container">
                    {/* <FilterProperty
                        categories={categories}
                        activeFilter={activeFilter}
                        onFilterChange={handleFilterChange}
                    /> */}
                    <FilterProperty categories={categories} />
                    <div className="row properties-box">
                        {isLoading ? (
                            <Spinner />
                        ) : error ? (
                            <Message variant="danger">
                                {error?.data?.message || error.error}
                            </Message>
                        ) : (
                            <>
                                {filteredProperties.map((item: PostInfo) => (
                                    <PropertyItem key={item._id} {...item} />
                                ))}
                            </>
                        )}
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <PaginationProperties
                                pages={data?.numberOfPages}
                                page={data?.pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
