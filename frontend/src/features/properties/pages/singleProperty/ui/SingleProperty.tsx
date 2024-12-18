import {
    useGetAllPropertiesQuery,
    useGetSinglePropertyQuery,
} from 'features/properties/api/propertiesApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BestDeal } from 'features/homepage/ui/bestDeal';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import { PropItems } from 'shared/types/PostInfo';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/message';
import { renderError } from 'shared/utils/renderError';
import Accordion from 'widgets/accordion/Accordion';

import InfoIcon from 'shared/assets/icons/info-icon-01.png';
import InfoIconTwo from 'shared/assets/icons/info-icon-02.png';
import InfoIconThree from 'shared/assets/icons/info-icon-03.png';
import InfoIconFour from 'shared/assets/icons/info-icon-04.png';

export const SingleProperty = () => {
    const { id } = useParams();
    const {
        data: dataSingle,
        isLoading,
        error,
    } = useGetSinglePropertyQuery(id);
    const singleP = dataSingle?.propertyPage;
    const { data } = useGetAllPropertiesQuery('1');

    const propItems = data?.properties || [];

    if (isLoading) {
        return <Loader />;
    }
    // const titlePost = singleP.title;
    // console.log(data);
    // console.log(singleP);
    return (
        <>
            <Breadcrumbs lastParent={singleP.title} nameParent={'Properties'} />
            <div className="single-property section">
                <div className="container">
                    {isLoading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">{renderError(error)}</Message>
                    ) : (
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="main-image">
                                    <img
                                        src="assets/images/single-property.jpg"
                                        alt=""
                                    />
                                </div>
                                <div className="main-content">
                                    <span className="category">
                                        {singleP?.category}
                                    </span>
                                    {/* <h4> {singleP?.title}</h4> */}
                                    <p>{singleP?.description}</p>
                                </div>
                                <Accordion
                                    questionsAndAnswers={
                                        singleP.questionsAndAnswers
                                    }
                                />
                                {/*Accordion */}
                            </div>
                            <div className="col-lg-4">
                                <div className="info-table">
                                    <ul>
                                        <li>
                                            <img
                                                src={InfoIcon}
                                                alt=""
                                                style={{ maxWidth: '52px' }}
                                            />
                                            <h4>
                                                450 m2
                                                <br />
                                                <span>Total Flat Space</span>
                                            </h4>
                                        </li>
                                        <li>
                                            <img
                                                src={InfoIconTwo}
                                                alt=""
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
                                                alt=""
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
                                                alt=""
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
                    )}
                </div>
            </div>

            <BestDeal propItems={propItems} />
        </>
    );
};
