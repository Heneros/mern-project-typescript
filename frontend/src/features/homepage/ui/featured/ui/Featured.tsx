import { useGetSinglePropertyQuery } from 'features/properties/api/propertiesApiSlice';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { postIdProperty } from 'shared/consts';
import { PostInfo } from 'shared/types';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/message';
import { getErrorMessage } from 'shared/utils/getErrorMessage';
import FeaturedIcon from 'shared/assets/icons/featured-icon.png';
import InfoIcon from 'shared/assets/icons/info-icon-01.png';
import InfoIconTwo from 'shared/assets/icons/info-icon-02.png';
import InfoIconThree from 'shared/assets/icons/info-icon-03.png';
import InfoIconFour from 'shared/assets/icons/info-icon-04.png';
import Accordion from 'widgets/accordion/Accordion';

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
                        <Link to={`/post/${data.propertyPage._id}`}>
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
                        <h6>{data.propertyPage.title}</h6>
                        <h2>
                            {data.propertyPage.description.substring(0, 25)}
                        </h2>
                    </div>
                    <>
                        {data.propertyPage.questionsAndAnswers ? (
                            <Accordion
                                questionsAndAnswers={
                                    data.propertyPage.questionsAndAnswers
                                }
                            />
                        ) : (
                            <>No QA</>
                        )}
                    </>
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
