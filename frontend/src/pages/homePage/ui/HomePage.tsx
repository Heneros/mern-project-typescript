import React from 'react';
import { Featured } from 'widgets/Featured';
import { SliderBanner } from 'widgets/Slider';

export function HomePage() {
    return (
        <>
            <div className="main-banner">
                <SliderBanner />
            </div>
            <div className="featured section">
                <Featured />
            </div>
        </>
    );
}
