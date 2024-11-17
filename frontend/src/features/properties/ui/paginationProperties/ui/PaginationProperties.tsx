import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

interface PaginateProps {
    isAdmin: boolean;
    pages: number;
    page: number;
}

export const PaginationProperties: React.FC<PaginateProps> = ({
    isAdmin,
    pages,
}) => {
    const location = useLocation();
    const currentPathPage = parseInt(
        location.pathname.split('/').pop() || '1',
        10,
    );

    const renderPagination = () => {
        const pageLinks = [];

        for (let i = 1; i <= pages; i++) {
            const isActive = i === currentPathPage;
            const linkClass = isActive ? 'is_active' : '';

            // console.log(i);
            pageLinks.push(
                <li key={i}>
                    <Link
                        className={linkClass}
                        to={
                            isAdmin
                                ? `/properties/page/${i}`
                                : `/admin/all-posts/${i}`
                        }
                    >
                        {i}
                    </Link>
                </li>,
            );
        }
        return pageLinks;
    };

    return pages > 1 && <Pagination>{renderPagination()}</Pagination>;
};
