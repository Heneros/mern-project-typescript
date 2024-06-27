import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import React, { useState } from 'react';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Spinner } from 'react-bootstrap';
import { Message } from 'shared/ui/Message';
import { PropertyItem } from 'widgets/PropertyItem';

export function Properties() {
    const [page, setPage] = useState(0);
    const { data, isLoading, isSuccess, isError, error } =
        useGetAllPropertiesQuery(page);
    /// console.log(data);

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <>
            <Breadcrumbs />
            <div className="section properties">
                <div className="container">
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
                        <li>
                            <a href="#!" data-filter=".str">
                                Villa House
                            </a>
                        </li>
                        <li>
                            <a href="#!" data-filter=".rac">
                                Penthouse
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
                                {data.properties.map((item) => (
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
