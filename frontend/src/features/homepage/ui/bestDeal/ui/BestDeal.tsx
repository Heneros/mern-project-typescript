import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
// import { useGetAllPropertiesQuery } from 'features/propItems/propertiesApiSlice';
import { PostInfo } from 'shared/types';
// import { Message } from 'shared/ui/Message';
// import { Spinner } from 'react-bootstrap';
// import { renderError } from 'shared/utils/renderError';
import { ScheduleBtn } from 'shared/ui/ScheduleBtn';
import { addToCart, ICartItem } from 'entities/СartHeader/index';
import { toast } from 'react-toastify';
import { PropItems } from 'shared/types/PostInfo';

export const BestDeal: React.FC<PropItems> = ({ propItems }) => {
    // const { data, isLoading, error } = useGetAllPropertiesQuery('1');
    // const propItems = data && data.propItems ? data.propItems : [];

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [currentProperty, setCurrentProperty] = useState<PostInfo | null>(
        null,
    );
    const dispatch = useAppDispatch();
    const categories: string[] = Array.from(
        new Set(
            propItems?.map(
                (currentProperty: PostInfo) => currentProperty.category,
            ),
        ),
    );

    useEffect(() => {
        if (propItems.length > 0) {
            setCurrentProperty(propItems[0]);
            if (!selectedCategory) {
                setSelectedCategory(propItems[0].category);
            }
        }
    }, [propItems, selectedCategory]);

    useEffect(() => {
        if (selectedCategory) {
            const filteredProperties = propItems.filter(
                (property: PostInfo) => property.category === selectedCategory,
            );
            if (filteredProperties.length > 0) {
                setCurrentProperty(filteredProperties[0]);
            }
        }
    }, [selectedCategory, propItems]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const cartItems = useAppSelector((state) => state.cart.cartItems);
    // console.log('cartItems', cartItems);

    const addToCartHandler = () => {
        if (currentProperty) {
            const isItemInCart = cartItems.some(
                (item: ICartItem) => item._id === currentProperty._id,
            );

            if (!isItemInCart) {
                const cartItem: ICartItem = {
                    _id: currentProperty._id,
                    property: currentProperty._id,
                    title: currentProperty.title,
                    preview: currentProperty.preview,
                    price: currentProperty.price,
                    city: currentProperty.city,
                };
                dispatch(addToCart(cartItem));
                toast.success(
                    `Property ${currentProperty.title} added to cart!`,
                );
            } else {
                toast.error('Property already in cart');
            }
        }
    };

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
                                                        className="nav-currentProperty"
                                                        role="presentation"
                                                        key={index}
                                                    >
                                                        <button
                                                            className={`nav-link ${selectedCategory === category ? 'active' : ''}`}
                                                            onClick={() =>
                                                                handleCategoryChange(
                                                                    category,
                                                                )
                                                            }
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
                                        {currentProperty ? (
                                            <>
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="appartment"
                                                    role="tabpanel"
                                                    aria-labelledby="appartment-tab"
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
                                                                                currentProperty?.area
                                                                            }
                                                                            m2
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        Floor
                                                                        number
                                                                        <span>
                                                                            {
                                                                                currentProperty?.floor
                                                                            }
                                                                            th
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        Number
                                                                        of rooms{' '}
                                                                        <span>
                                                                            {currentProperty?.bedrooms +
                                                                                currentProperty?.bathrooms}
                                                                        </span>
                                                                    </li>
                                                                    <li>
                                                                        Parking
                                                                        Available{' '}
                                                                        <span>
                                                                            {currentProperty.parking >
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
                                                                    currentProperty?.preview
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <h4>
                                                                Extra Info About
                                                                Property
                                                            </h4>
                                                            <p>
                                                                {
                                                                    currentProperty?.description
                                                                }
                                                            </p>
                                                            <div className="icon-button">
                                                                <ScheduleBtn
                                                                    onClick={
                                                                        addToCartHandler
                                                                    }
                                                                    isInCart={
                                                                        false
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
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
