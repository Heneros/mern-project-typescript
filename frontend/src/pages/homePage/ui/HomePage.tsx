import { useGetAllPropertiesQuery } from 'features/properties/api/propertiesApiSlice';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { BestDeal } from 'features/homepage/ui/bestDeal';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';

import { Featured } from 'features/homepage/ui/featured';
import { FunFacts } from 'features/homepage/ui/funFacts';
import { HomePageProperties } from 'features/homepage/ui/homePageProperties';

import { Video } from 'features/homepage/ui/video';
import { HomePageContactUs } from 'features/homepage/ui/homePageContactUs/ui/HomePageContactUs';
import { SliderBanner } from 'features/homepage/ui/slider';

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
