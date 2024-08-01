import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { BestDeal } from 'shared/ui/BestDeal';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';

import { Featured } from 'widgets/Featured';
import { FunFacts } from 'widgets/FunFacts';
import { HomePageProperties } from 'widgets/HomePageProperties';
import { SliderBanner } from 'widgets/Slider';
import { Video } from 'widgets/Video';
import { HomePageContactUs } from 'widgets/HomePageContactUs';

export function HomePage() {
    const { data, isLoading, error } = useGetAllPropertiesQuery(1);

    // if (isLoading && error) {
    //     return <Loader />;
    // }
    const propItems = data?.properties || [];
    // console.log(propItems);
    return (
        <>
            {/* SliderBanner section*/}
            <div className="main-banner">
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <Message variant="danger">{renderError(error)} </Message>
                ) : (
                    <SliderBanner propItems={propItems} />
                )}
            </div>
            <div className="featured section">
                <Featured items={[]} />
            </div>
            {/* Video section*/}
            <Video />
            {/* FunFacts section*/}
            <FunFacts />
            {/* BestDeal section*/}
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <Message variant="danger">{renderError(error)} </Message>
            ) : (
                <BestDeal propItems={propItems} />
            )}
            {/* HomePageProperties section*/}
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <Message variant="danger">{renderError(error)} </Message>
            ) : (
                <HomePageProperties propItems={propItems} />
            )}
            <HomePageContactUs />
        </>
    );
}
