import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface PaginateProps {
    pages: number;
    currentPage: number;
}

export const PaginationProperties: React.FC<PaginateProps> = ({
    pages,
    currentPage,
}) => {
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        pages > 1 && (
            <Pagination>
                {pageNumbers.map((pageNumber) => (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                    >
                        <Link to={`/properties/${pageNumber}`}>
                            {pageNumber}
                        </Link>
                    </Pagination.Item>
                ))}
            </Pagination>
        )
    );
};
