import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BgImgBread from 'shared/assets/images/page-heading-bg.jpg';

interface BreadType {
    bgImg?: string;
    nameParent?: string;
}

export const Breadcrumbs: React.FC<BreadType> = ({
    nameParent,
    bgImg = BgImgBread,
}) => {
    const location = useLocation();
    const pathname = location.pathname;
    const parts = pathname.split('/');
    // console.log(parts);

    const lastPart = parts[parts.length - 1];
    return (
        <>
            <div
                className="page-heading header-text"
                style={{ backgroundImage: `url(${bgImg})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="breadcrumb">
                                <Link to={'/'}>Home</Link>
                                {nameParent ? ` / ${nameParent}` : ''}
                            </span>
                            <h3>{lastPart}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
