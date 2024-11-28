import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './PaginationProperties.css';
interface PaginateProps {
    isAdmin: boolean;
    pages: number;
    page: number;
}

export const PaginationProperties: React.FC<PaginateProps> = ({
    isAdmin,
    pages,
    page,
}) => {
    const location = useLocation();

    const isAllUsersPath = location.pathname.includes('/admin/all-users');
    const isAllPostsPath = location.pathname.includes('/admin/all-posts');

    const renderPagination = () => {
        const pageLinks = [];

        for (let i = 1; i <= pages; i++) {
            const isActive = i === page;
            console.log(page);

            const linkPath = isAllUsersPath
                ? `/admin/all-users/${i}`
                : isAllPostsPath
                  ? `/admin/all-posts/${i}`
                  : `/properties/page/${i}`;

            pageLinks.push(
                <li key={i} className={isActive ? 'active' : ''}>
                    <Link to={linkPath}>{i}</Link>
                </li>,
            );
        }
        return pageLinks;
    };

    return <ul className="pagination">{renderPagination()}</ul>;
};
