import { useGetSinglePropertyQuery } from 'features/properties/propertiesApiSlice';
import React from 'react';
import { Link } from 'react-router-dom';
import { postIdProperty } from 'shared/consts';
import { ISlides } from 'shared/types';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';



export const Featured: React.FC<{ items: ISlides[] }> = () => {
    const { data, isLoading, error } = useGetSinglePropertyQuery(
        postIdProperty.id,
    );

    console.log(data);
    const getErrorMessage = (error: any): string => {
        if ('status' in error) {
            return `Error: ${error.status}`;
        } else if ('message' in error) {
            return error.message;
        } else {
            return 'An unknown error occurred';
        }
    };
    const postSingle = data?.propertyPage ? (
        <div key={data.propertyPage.title}>
            <h1>{data.propertyPage.title}</h1>
            {/* Render other details */}
            <div className="row">
                <div className="col-lg-4">
                    <div className="left-image">
                        <img
                            src={data.propertyPage.preview}
                            alt={data.propertyPage.title}
                        />
                        <Link to={`/properties/${data.propertyPage.id}`}>
                            {/* <img src={{}} alt="" /> */}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    console.log(postSingle);
    // const renderPost = data?.propertyPage?.map((item: ISlides) => (
    //     <>
    //         <h1>{item?.title}</h1>
    //     </>
    // ));

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message>{getErrorMessage(error)}</Message>
            ) : (
                <>
                    <div className="container">
                        {postSingle}

                        {/* <div className="col-lg-4">
                                <div className="left-image">
                                    <img
                                        src="assets/images/featured.jpg"
                                        alt=""
                                    />
                                    <a href="property-details.html">
                                        <img
                                            src="assets/images/featured-icon.png"
                                            alt=""
                                            style={{
                                                maxWidth: '60px',
                                                padding: '0px',
                                            }}
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="section-heading">
                                    <h6>| Featured</h6>
                                    <h2>Best Appartment &amp; Sea view</h2>
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
                                                Get{' '}
                                                <strong>the best villa</strong>{' '}
                                                website template in HTML CSS and
                                                Bootstrap for your business.
                                                TemplateMo provides you the{' '}
                                                <a
                                                    href="https://www.google.com/search?q=best+free+css+templates"
                                                    target="_blank"
                                                >
                                                    best free CSS templates
                                                </a>{' '}
                                                in the world. Please tell your
                                                friends about it.
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
                                                doesn't eiusmod tempor
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
                                                Why is Villa Agency the best ?
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
                                                doesn't eiusmod tempor
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
                            <div className="col-lg-3">
                                <div className="info-table">
                                    <ul>
                                        <li>
                                            <img
                                                src="assets/images/info-icon-01.png"
                                                alt=""
                                                style={{
                                                    maxWidth: '52px',
                                                }}
                                            />
                                            <h4>
                                                250 m2
                                                <br />
                                                <span>Total Flat Space</span>
                                            </h4>
                                        </li>
                                        <li>
                                            <img
                                                src="assets/images/info-icon-02.png"
                                                alt=""
                                                style={{
                                                    maxWidth: '52px',
                                                }}
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
                                                style={{
                                                    maxWidth: '52px',
                                                }}
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
                                                style={{
                                                    maxWidth: '52px',
                                                }}
                                            />
                                            <h4>
                                                Safety
                                                <br />
                                                <span>24/7 Under Control</span>
                                            </h4>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
                    </div>
                </>
            )}
        </>
    );
};
