import {
    useGetAllPropertiesQuery,
    useGetSinglePropertyQuery,
} from 'features/properties/api/propertiesApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BestDeal } from 'features/homepage/ui/bestDeal';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { PropItems } from 'shared/types/PostInfo';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';

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
    const titlePost = singleP.title;
    // console.log(data);
    console.log(singleP);
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
                                    <h4> {singleP?.title}</h4>
                                    <p>{singleP?.description}</p>
                                </div>
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                Best useful links ?
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                Dolor{' '}
                                                <strong>almesit amet</strong>,
                                                consectetur adipiscing elit, sed
                                                doesn't eiusmod tempor kinfolk
                                                tonx seitan crucifix 3 wolf moon
                                                bicycle rights keffiyeh
                                                snackwave wolf same vice,
                                                chillwave vexillologist
                                                incididunt ut labore consectetur{' '}
                                                <code>adipiscing</code> elit,
                                                sed do eiusmod tempor incididunt
                                                ut labore et dolore magna
                                                aliqua.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingTwo"
                                        >
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                How does this work ?
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingTwo"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                Dolor{' '}
                                                <strong>almesit amet</strong>,
                                                consectetur adipiscing elit, sed
                                                doesn't eiusmod tempor kinfolk
                                                tonx seitan crucifix 3 wolf moon
                                                bicycle rights keffiyeh
                                                snackwave wolf same vice,
                                                chillwave vexillologist
                                                incididunt ut labore consectetur{' '}
                                                <code>adipiscing</code> elit,
                                                sed do eiusmod tempor incididunt
                                                ut labore et dolore magna
                                                aliqua.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingThree"
                                        >
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                Why is Villa the best ?
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseThree"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                Dolor{' '}
                                                <strong>almesit amet</strong>,
                                                consectetur adipiscing elit, sed
                                                doesn't eiusmod tempor kinfolk
                                                tonx seitan crucifix 3 wolf moon
                                                bicycle rights keffiyeh
                                                snackwave wolf same vice,
                                                chillwave vexillologist
                                                incididunt ut labore consectetur{' '}
                                                <code>adipiscing</code> elit,
                                                sed do eiusmod tempor incididunt
                                                ut labore et dolore magna
                                                aliqua.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="info-table">
                                    <ul>
                                        <li>
                                            <img
                                                src="assets/images/info-icon-01.png"
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
                                                src="assets/images/info-icon-02.png"
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
                                                src="assets/images/info-icon-03.png"
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
                                                src="assets/images/info-icon-04.png"
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
