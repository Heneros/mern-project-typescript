import React from 'react';

export const PropertyItem = ({ title }) => {
    return (
        <div className="col-lg-4 col-md-6 align-self-center mb-30 properties-items col-md-6 adv">
            <div className="item">
                <a href="property-details.html">
                    <img src="assets/images/property-01.jpg" alt="" />
                </a>
                <span className="category">Luxury Villa</span>
                <h6>$2.264.000</h6>
                <h4>
                    <a href="property-details.html">{title}</a>
                </h4>
                <ul>
                    <li>
                        Bedrooms: <span>8</span>
                    </li>
                    <li>
                        Bathrooms: <span>8</span>
                    </li>
                    <li>
                        Area: <span>545m2</span>
                    </li>
                    <li>
                        Floor: <span>3</span>
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
