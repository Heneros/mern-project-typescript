import React from 'react';

export const FilterProperty = () => {
    return (
        <>
            <ul className="properties-filter">
                <li>
                    <a className="is_active" href="#!" data-filter="*">
                        Show All
                    </a>
                </li>
                <li>
                    <a href="#!" data-filter=".adv">
                        Apartment
                    </a>
                </li>
                <li>
                    <a href="#!" data-filter=".str">
                        Villa House
                    </a>
                </li>
                <li>
                    <a href="#!" data-filter=".rac">
                        Penthouse
                    </a>
                </li>
            </ul>
        </>
    );
};
