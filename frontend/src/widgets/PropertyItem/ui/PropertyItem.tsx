import React from 'react';
import { Link } from 'react-router-dom';
import { PostInfo } from 'shared/types';

export const PropertyItem: React.FC<PostInfo> = ({
    _id,
    title,
    price,
    preview,
    category,
    bedrooms,
    bathrooms,
    area,
    floor,
}) => {
    return (
        <div
            key={_id}
            className={`col-lg-4 col-md-6 align-self-center mb-30 properties-items col-md-6 ${category.slice(0, 3).toLocaleLowerCase()} `}
        >
            <div className="item">
                <Link to={`/properties/${_id}`}>
                    <img src={preview} alt="preview image of villa" />
                </Link>
                <span className="category">{category}</span>
                <h6>{price} </h6>
                <h4>
                    <Link to={`/properties/${_id}`}>{title}</Link>
                </h4>
                <ul>
                    <li>
                        Bedrooms: <span>{bedrooms}</span>
                    </li>
                    <li>
                        Bathrooms: <span>{bathrooms}</span>
                    </li>
                    <li>
                        Area: <span>{area} m2</span>
                    </li>
                    <li>
                        Floor: <span>{floor} </span>
                    </li>
                    <li>
                        Parking: <span>6 spots</span>
                    </li>
                </ul>
                <div className="main-button">
                    <a href="property-details.html">Schedule a visit</a>
                </div>
            </div>
        </div>
    );
};
