import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import clsx from 'clsx';
import { ISlides } from 'shared/types';
import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';

interface ISleder {
    readonly slides: ISlides[];
    readonly className?: string;
}

export const SliderBanner = () => {
    const { data, isLoading, error } = useGetAllPropertiesQuery();

    const settings = {
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Slider {...settings} className="slick-carousel slick-banner">
            <div className="item item-1">
                <div className="header-text">
                    <span className="category">
                        Toronto, <em>Canada</em>
                    </span>
                    <h2>
                        Hurry!
                        <br />
                        Get the Best Villa for you
                    </h2>
                </div>
            </div>
            <div className="item item-2">
                <div className="header-text">
                    <span className="category">
                        Melbourne, <em>Australia</em>
                    </span>
                    <h2>
                        Be Quick!
                        <br />
                        Get the best villa in town
                    </h2>
                </div>
            </div>
            <div className="item item-3">
                <div className="header-text">
                    <span className="category">
                        Miami, <em>South Florida</em>
                    </span>
                    <h2>
                        Act Now!
                        <br />
                        Get the highest level penthouse
                    </h2>
                </div>
            </div>
        </Slider>
    );
};

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', right: '10px' }}
            onClick={onClick}
        >
            <i className="fa fa-angle-right" aria-hidden="true"></i>
        </div>
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', left: '10px' }}
            onClick={onClick}
        >
            <i className="fa fa-angle-left" aria-hidden="true"></i>
        </div>
    );
};
