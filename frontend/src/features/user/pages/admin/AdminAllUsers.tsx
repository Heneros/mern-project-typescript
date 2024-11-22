import { useGetAllUsersQuery } from 'features/user/userApiSlice';
import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';
import NavMenu from 'widgets/navMenu/ui/NavMenu';

const AdminAllUsers = () => {
    const { data: usersList, isLoading, error } = useGetAllUsersQuery();
    const
    console.log(usersList);
    return (
        <>
            <Breadcrumbs lastParent={'All Users'} />
            <Container>
                <Row>
                    <Col md={3} className="mt-4 mb-2">
                        <NavMenu />
                    </Col>
                    <Col md={9}>
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message>{renderError(error)}</Message>
                        ) : (
                            <>
                                <h1 className="text-center">Users</h1>
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
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Active</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>{usersList.map(() =>(<></>))}</tbody>
                                </Table>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminAllUsers;
