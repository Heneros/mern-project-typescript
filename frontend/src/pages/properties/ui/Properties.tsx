import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import React, { useMemo, useState } from 'react';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Spinner } from 'react-bootstrap';
import { Message } from 'shared/ui/Message';
import { PropertyItem } from 'widgets/PropertyItem';
import { PostInfo } from 'shared/types';
import { FilterProperty } from 'widgets/FilterProperty';

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

    const categories = Array.from(new Set(data?.properties));
    const filteredProperties =
        activeFilter === 'all'
            ? data?.properties
            : data.properties.filter((item: PostInfo) =>
                  item.category.slice(0, 3),
              );
    console.log(categories);

    return (
        <>
            <Breadcrumbs />
            <div className="section properties">
                <div className="container">
                    {/* <FilterProperty {...data} /> */}
                    <ul className="properties-filter">
                        <li>
                            <a className="is_active" href="#!" data-filter="*">
                                Show All
                            </a>
                        </li>
                        <li>
                            <a href="#!" data-filter=".adv">
                                Apartment
                            </a>
                        </li>
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
                                {data.properties.map((item: PostInfo) => (
                                    <PropertyItem {...item} />
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
