import {
    useDeletePropertyMutation,
    useGetAllPropertiesQuery,
} from 'features/properties/api/propertiesApiSlice';
import React from 'react';
import { format } from 'date-fns';
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { PostInfo } from 'shared/types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PaginationProperties } from 'features/properties/ui/paginationProperties';
import Paginate from 'widgets/paginate/Paginate';

const AdminAllPosts = () => {
    const { pageNumber = '1' } = useParams();
    const currentPage = Number(pageNumber);

    const { data, isLoading, error, refetch } =
        useGetAllPropertiesQuery(currentPage);

    const [deletePost] = useDeletePropertyMutation();

    const deleteHandler = async (id: string) => {
        if (window.confirm('Are you sure')) {
            try {
                await deletePost(id);
                refetch();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const propertiesList = data?.properties ?? [];

    return (
        <>
            <Breadcrumbs nameParent={'Test'} lastParent={'qw'} />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>
                    <Col md={9} className="mt-4 mb-2">
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message>{renderError(error)}</Message>
                        ) : (
                            <>
                                <h1 className="text-center">Posts</h1>
                                <Table
                                    striped
                                    bordered
                                    hover
                                    responsive
                                    className="table-sm my-2"
                                >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Country</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propertiesList.map(
                                            (post: PostInfo) => (
                                                <tr key={post._id}>
                                                    <td> {post._id} </td>
                                                    <td> {post.title} </td>
                                                    <td> {post.category} </td>
                                                    <td> {post.country} </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                post.createdAt,
                                                            ),
                                                            'MMMM dd, yyyy',
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/post/${post._id}/edit`}
                                                            style={{
                                                                color: 'red',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <Button
                                                                variant="light"
                                                                className="btn-sm mx-2"
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="danger"
                                                            className="btn-sm"
                                                            onClick={() =>
                                                                deleteHandler(
                                                                    post._id,
                                                                )
                                                            }
                                                        >
                                                            <FaTrash
                                                                style={{
                                                                    color: 'white',
                                                                }}
                                                            />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </Table>
                            </>
                        )}
                        <Row>
                            <Col lg={12}>
                                <PaginationProperties
                                    pages={data?.numberOfPages}
                                    page={data?.pageNumber}
                                    isAdmin={false}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminAllPosts;
