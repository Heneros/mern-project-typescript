import React from 'react';
import { Featured } from 'widgets/Featured';
import { FunFacts } from 'widgets/FunFacts';
import { SliderBanner } from 'widgets/Slider';
import { Video } from 'widgets/Video';

export function HomePage() {
    return (
        <>
            <div className="main-banner">
                <SliderBanner />
            </div>
            <div className="featured section">
                <Featured items={[]} />
            </div>
            {/* Video section*/}
            <Video />
            {/* End Video section*/}

            {/* FunFacts section*/}
            <FunFacts />
            {/* FunFacts section*/}
        </>
    );
}
