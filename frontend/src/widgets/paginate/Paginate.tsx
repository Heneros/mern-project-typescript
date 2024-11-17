import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
const Paginate = ({ pages, page, isAdmin = false }) => {
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                        key={x + 1}
                        to={
                            isAdmin
                                ? `/properties/page/${x + 1}`
                                : `/admin/all-posts/${x + 1}`
                        }
                    >
                        <Pagination.Item>{x + 1}</Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
};

export default Paginate;
