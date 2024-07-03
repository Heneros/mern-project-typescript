// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// interface FilterPropertyProps {
//     categories: string[];
//     activeFilter: string;
//     onFilterChange: (filter: string) => void;
// }

// export const FilterProperty: React.FC<FilterPropertyProps> = ({
//     categories,
//     activeFilter,
//     onFilterChange,
// }) => {
//     const handleFilterClick = (filter: string) => {
//         onFilterChange(filter);
//     };
//     return (
//         <>
//             <ul className="properties-filter">
//                 <li>
//                     <Link
//                         className={activeFilter === 'all' ? 'is_active' : ''}
//                         to={'#!'}
//                         onClick={() => handleFilterClick('all')}
//                         data-filter="*"
//                     >
//                         Show All
//                     </Link>
//                 </li>
//                 {categories?.map((category, index) => (
//                     <li key={index}>
//                         <Link
//                             className={
//                                 activeFilter === category ? 'is_active' : ''
//                             }
//                             onClick={() => handleFilterClick(category)}
//                             to={''}
//                         >
//                             {category}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </>
//     );
// };

import { updateCategoryFilter } from 'features/properties/propertySlice';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';

interface FilterPropertyProps {
    categories: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const FilterProperty: React.FC<FilterPropertyProps> = ({
    categories,
}) => {
    const dispatch = useAppDispatch();
    const { properties, selectedCategory } = useAppSelector(
        (state) => state.properties,
    );

    const handleCategoryClick = (category) => {
        dispatch(updateCategoryFilter(category));
    };

    const viewAll = () => {
        dispatch(updateCategoryFilter(null));
    };

    return (
        <ul className="properties-filter">
            <li>
                <button onClick={viewAll}>View All</button>
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
