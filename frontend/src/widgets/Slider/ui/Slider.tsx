import React, { useState } from 'react';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { ISlides } from 'shared/types';
import { useGetAllPropertiesQuery } from 'features/properties/propertiesApiSlice';

export const SliderBanner = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const { data, isLoading, error } = useGetAllPropertiesQuery(page);

    console.log(data);

    const slidesItem = data?.properties.map((item: ISlides) => (
        <SwiperSlide>
            <div
                className="item item-1"
                style={{ backgroundImage: `url(${item.preview})` }}
            >
                <div className="header-text">
                    <span className="category">
                        {item.city}, <em>{item.country}</em>
                    </span>
                    <h2>
                        {item.description
                            ? item.description.substring(0, 15)
                            : ''}
                    </h2>
                </div>
            </div>
        </SwiperSlide>
    ));
    return (
        <Swiper
            spaceBetween={25}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
        >
            {slidesItem}
        </Swiper>
    );
};
