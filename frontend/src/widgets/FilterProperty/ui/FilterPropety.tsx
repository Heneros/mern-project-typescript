import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FilterPropertyProps {
    categories: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const FilterProperty: React.FC<FilterPropertyProps> = ({
    categories,
    activeFilter,
    onFilterChange,
}) => {
    const handleFilterClick = (filter: string) => {
        onFilterChange(filter);
    };
    return (
        <>
            <ul className="properties-filter">
                <li>
                    <Link
                        className={activeFilter === 'all' ? 'is_active' : ''}
                        to={'#!'}
                        onClick={() => handleFilterClick('all')}
                        data-filter="*"
                    >
                        Show All
                    </Link>
                </li>
                {categories?.map((category, index) => (
                    <li key={index}>
                        <Link
                            className={
                                activeFilter === category ? 'is_active' : ''
                            }
                            onClick={() => handleFilterClick(category)}
                            to={''}
                        >
                            {category}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};
