import React from 'react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ISlides } from 'shared/types';

interface ISleder {
    readonly slides: ISlides[];
    readonly className?: string;
}

export const Slider = () => {
    return <div>Slider</div>;
};
