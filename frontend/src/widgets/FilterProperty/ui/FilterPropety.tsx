import { updateCategoryFilter } from 'features/properties/propertySlice';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';

interface FilterPropertyProps {
    categories: string[];
}

export const FilterProperty: React.FC<FilterPropertyProps> = ({
    categories,
}) => {
    const dispatch = useAppDispatch();
    const { selectedCategory } = useAppSelector((state) => state.properties);

    const handleCategoryClick = (category: string) => {
        dispatch(updateCategoryFilter(category));
    };

    const viewAll = () => {
        dispatch(updateCategoryFilter(null));
    };

    return (
        <ul className="properties-filter">
            <li>
                <Link
                    to="#"
                    onClick={viewAll}
                    className={`${!selectedCategory ? 'is_active' : ''}`}
                >
                    View All
                </Link>
            </li>
            {categories?.map((category, index) => (
                <li>
                    <Link
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        className={`${selectedCategory === category ? 'is_active' : ''}`}
                        to={''}
                    >
                        {category}
                    </Link>
                </li>
            ))}
        </ul>
    );
};
