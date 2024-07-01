import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Spinner } from 'react-bootstrap';
import { Message } from 'shared/ui/Message';
import { PropertyItem } from 'widgets/PropertyItem';
import { PostInfo } from 'shared/types';
import { FilterProperty } from 'widgets/FilterProperty';
import { Link } from 'react-router-dom';

export function Properties() {
    const [page, setPage] = useState(0);
    const { data, isLoading, isError, error } = useGetAllPropertiesQuery(page);

    /// console.log(data);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };
    if (isLoading) {
        return 'Loading...';
    }

    const categories: string[] = Array.from(
        new Set(data?.properties.map((item: PostInfo) => item.category)),
    );

    const filteredProperties =
        activeFilter === 'all'
            ? data.properties
            : data?.properties.filter(
                  (item: PostInfo) => item.category === activeFilter,
              );

    console.log(filteredProperties);

    return (
        <>
            <Breadcrumbs />
            <div className="section properties">
                <div className="container">
                    <ul className="properties-filter">
                        <li>
                            <Link
                                className={
                                    activeFilter === 'all' ? 'is_active' : ''
                                }
                                to={'#!'}
                                onClick={() => handleFilterClick('all')}
                                data-filter="*"
                            >
                                Show All
                            </Link>
                        </li>
                        {categories?.map((category, index) => (
                            <li key={index}>
                                <Link
                                    className={
                                        activeFilter === category
                                            ? 'is_active'
                                            : ''
                                    }
                                    onClick={() => handleFilterClick(category)}
                                    to={''}
                                >
                                    {category}
                                </Link>
                            </li>
                        ))}
                    </ul>
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
                            <ul className="pagination">
                                <li>
                                    <a href="#">1</a>
                                </li>
                                <li>
                                    <a className="is_active" href="#">
                                        2
                                    </a>
                                </li>
                                <li>
                                    <a href="#">3</a>
                                </li>
                                <li>
                                    <a href="#"></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
