import { useGetSinglePropertyQuery } from 'features/properties/propertiesApiSlice';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postIdProperty } from 'shared/consts';
import { PostInfo } from 'shared/types';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { getErrorMessage } from 'shared/utils/getErrorMessage';

import FeaturedIcon from 'shared/assets/icons/featured-icon.png';
import InfoIcon from 'shared/assets/icons/info-icon-01.png';
import InfoIconTwo from 'shared/assets/icons/info-icon-02.png';
import InfoIconThree from 'shared/assets/icons/info-icon-03.png';
import InfoIconFour from 'shared/assets/icons/info-icon-04.png';

export const Featured: React.FC<{ items: PostInfo[] }> = () => {
    const { data, isLoading, error } = useGetSinglePropertyQuery(
        postIdProperty.id,
    );
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };
    const postSingle = data?.propertyPage ? (
        <div key={data.propertyPage.id}>
            <div className="row">
                <div className="col-lg-4">
                    <div className="left-image">
                        <img
                            src={data.propertyPage.preview}
                            alt={data.propertyPage.title}
                        />
                        <Link to={`/properties/${data.propertyPage._id}`}>
                            <img
                                src={FeaturedIcon}
                                alt="icon"
                                style={{ maxWidth: '60px', padding: '0px' }}
                            />
                        </Link>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="section-heading">
                        <h6> {data.propertyPage.title}</h6>
                        <h2>
                            <h6>
                                {data.propertyPage.description.substring(0, 25)}
                            </h6>
                        </h2>
                    </div>

                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    onClick={() => toggleAccordion(0)}
                                    aria-expanded={activeIndex === 0}
                                    aria-controls="collapseOne"
                                >
                                    Question
                                </button>
                            </h2>
                            <div
                                id="collapseOne"
                                className={`accordion-collapse collapse ${activeIndex === 0 ? 'show' : ''}`}
                                aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Alias ullam sequi delectus
                                    ipsa deleniti eligendi, consectetur tempore
                                    ducimus quisquam officia aliquam porro amet!
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    onClick={() => toggleAccordion(1)}
                                    aria-expanded={activeIndex === 1}
                                    aria-controls="collapseTwo"
                                >
                                    Another question?
                                </button>
                            </h2>
                            <div
                                id="collapseTwo"
                                className={`accordion-collapse collapse ${activeIndex === 1 ? 'show' : ''}`}
                                aria-labelledby="headingTwo"
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">
                                    This is the answer to another question.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="info-table">
                        <ul>
                            <li>
                                <img
                                    src={InfoIcon}
                                    alt="icon"
                                    style={{ maxWidth: '52px' }}
                                />
                                <h4>
                                    {data.propertyPage.area} m2
                                    <br />
                                    <span>Total Flat Space</span>
                                </h4>
                            </li>
                            <li>
                                <img
                                    src={InfoIconTwo}
                                    alt="icon"
                                    style={{ maxWidth: '52px' }}
                                />
                                <h4>
                                    Contract
                                    <br />
                                    <span>Contract Ready</span>
                                </h4>
                            </li>
                            <li>
                                <img
                                    src={InfoIconThree}
                                    alt="icon"
                                    style={{ maxWidth: '52px' }}
                                />
                                <h4>
                                    Payment
                                    <br />
                                    <span>Payment Process</span>
                                </h4>
                            </li>
                            <li>
                                <img
                                    src={InfoIconFour}
                                    alt="icon"
                                    style={{ maxWidth: '52px' }}
                                />
                                <h4>
                                    Safety
                                    <br />
                                    <span>24/7 Under Control</span>
                                </h4>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message>{getErrorMessage(error)}</Message>
            ) : (
                <>
                    <div className="container">{postSingle}</div>
                </>
            )}
        </>
    );
};
