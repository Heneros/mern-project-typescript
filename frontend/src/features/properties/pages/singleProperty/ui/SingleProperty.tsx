import {
    useGetAllPropertiesQuery,
    useGetSinglePropertyQuery,
} from 'features/properties/api/propertiesApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BestDeal } from 'features/homepage/ui/bestDeal';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
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
    const { id: singleId } = useParams<{ id: string }>();

    const {
        data: dataSingle,
        isLoading: isLoadingSingle,
        error: errorSingle,
    } = useGetSinglePropertyQuery(singleId, { skip: !singleId });
    const {
        data,
        isLoading: isLoadingAll,
        error: errorAll,
    } = useGetAllPropertiesQuery('1');

    const propItems = data?.properties || [];

    const isLoading = isLoadingSingle || isLoadingAll;
    const error = errorSingle || errorAll;

    // const dataSingle?.propertyPage = dataSingle?.propertyPage;
    console.log(singleId);
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{renderError(error)}</Message>
            ) : (
                <>
                    <Breadcrumbs
                        lastParent={dataSingle?.propertyPage?.title}
                        nameParent={'Properties'}
                    />
                    <div className="single-property section">
                        <div className="container">
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
                                            {dataSingle?.propertyPage?.category}
                                        </span>
                                        {/* <h4> {dataSingle?.propertyPage?.title}</h4> */}
                                        <p>
                                            {
                                                dataSingle?.propertyPage
                                                    ?.description
                                            }
                                        </p>
                                    </div>
                                    <Accordion
                                        questionsAndAnswers={
                                            dataSingle?.propertyPage
                                                .questionsAndAnswers
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
                                                    <span>
                                                        Total Flat Space
                                                    </span>
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
                                                    <span>
                                                        24/7 Under Control
                                                    </span>
                                                </h4>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <BestDeal propItems={propItems} />
        </>
    );
};
