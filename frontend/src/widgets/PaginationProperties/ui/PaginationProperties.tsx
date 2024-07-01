import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface PaginateProps {
    pages: number;
    page: number;
}

export const PaginationProperties: React.FC<PaginateProps> = ({
    pages,
    page,
}) => {
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        pages > 1 && (
            <Pagination>
                {pageNumbers.map((x) => (
                    <>
                        <Link key={x + 1} to={`/properties/${x + 1}`}>
                            <Pagination.Item active={x + 1 === page}>
                                {x + 1}
                            </Pagination.Item>
                        </Link>
                    </>
                ))}
            </Pagination>
        )
    );
};
