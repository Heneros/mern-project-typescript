import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import { PostInfo } from 'shared/types';
import { Message } from 'shared/ui/Message';
import { Spinner } from 'react-bootstrap';
import { renderError } from 'shared/utils/renderError';

export const BestDeal = () => {
    const { data, isLoading, error } = useGetAllPropertiesQuery('1');
    const properties = data && data.properties ? data.properties : [];

    // const { selectedCategory } = useAppSelector((state) => state.properties);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    const [currentProperty, setCurrentProperty] = useState<PostInfo | null>(
        null,
    );

    useEffect(() => {
        if (properties.length > 0) {
            setCurrentProperty(properties[0]);
            if (!selectedCategory) {
                setSelectedCategory(properties[0].category);
            }
        }
    }, [properties, selectedCategory]);

    

    const categories: string[] = Array.from(
        new Set(data?.properties.map((item: PostInfo) => item.category)),
    );

    const filteredProperties = properties.filter((property: PostInfo) => {
        const categoryMatch =
            selectedCategory === null || property.category === selectedCategory;
        return categoryMatch;
    });

    console.log(filteredProperties);
    return (
        <>
            <div className="section best-deal">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="section-heading">
                                <h6>| Best Deal</h6>
                                <h2>Find Your Best Deal Right Now!</h2>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="tabs-content">
                                <div className="row">
                                    <div className="nav-wrapper ">
                                        <ul
                                            className="nav nav-tabs"
                                            role="tablist"
                                        >
                                            {categories?.map(
                                                (category, index) => (
                                                    <li
                                                        className="nav-item"
                                                        role="presentation"
                                                        key={index}
                                                    >
                                                        <button
                                                            className="nav-link active"
                                                            id="appartment-tab"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#appartment"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="appartment"
                                                            aria-selected="true"
                                                        >
                                                            {category}
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                    <div
                                        className="tab-content"
                                        id="myTabContent"
                                    >
                                        {isLoading ? (
                                            <Spinner />
                                        ) : error ? (
                                            <Message variant="danger">
                                                {renderError(error)}
                                            </Message>
                                        ) : (
                                            <>
                                                {filteredProperties.map(
                                                    (
                                                        item: PostInfo,
                                                        index: number,
                                                    ) => (
                                                        <div
                                                            className="tab-pane fade show active"
                                                            id="appartment"
                                                            role="tabpanel"
                                                            aria-labelledby="appartment-tab"
                                                            key={index}
                                                        >
                                                            <div className="row">
                                                                <div className="col-lg-3">
                                                                    <div className="info-table">
                                                                        <ul>
                                                                            <li>
                                                                                Total
                                                                                Flat
                                                                                Space{' '}
                                                                                <span>
                                                                                    {
                                                                                        item?.area
                                                                                    }
                                                                                    m2
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                Floor
                                                                                number
                                                                                <span>
                                                                                    {
                                                                                        item?.floor
                                                                                    }
                                                                                    th
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                Number
                                                                                of
                                                                                rooms{' '}
                                                                                <span>
                                                                                    {item?.bedrooms +
                                                                                        item?.bathrooms}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                Parking
                                                                                Available{' '}
                                                                                <span>
                                                                                    {item.parking >
                                                                                    0
                                                                                        ? 'Yes'
                                                                                        : 'No'}
                                                                                </span>
                                                                            </li>
                                                                            <li>
                                                                                Payment
                                                                                Process
                                                                                <span>
                                                                                    Bank
                                                                                </span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <img
                                                                        src={
                                                                            item?.preview
                                                                        }
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <h4>
                                                                        Extra
                                                                        Info
                                                                        About
                                                                        Property
                                                                    </h4>
                                                                    <p>
                                                                        {
                                                                            item?.description
                                                                        }
                                                                    </p>
                                                                    <div className="icon-button">
                                                                        <a href="property-details.html">
                                                                            <i className="fa fa-calendar"></i>{' '}
                                                                            Schedule
                                                                            a
                                                                            visit
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
