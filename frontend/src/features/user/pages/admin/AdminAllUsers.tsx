import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
    useDeactivateUserMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
} from 'features/user/userApiSlice';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    Pagination,
    Row,
    Table,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/message';
import { renderError } from 'shared/utils/renderError';
import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { useParams } from 'react-router-dom';
import { PaginationProperties } from 'widgets/paginationProperties';

const AdminAllUsers = () => {
    const { pageNumber = '1' } = useParams();
    const currentPage = Number(pageNumber);

    const { data, isLoading, isSuccess, isError, error, refetch } =
        useGetAllUsersQuery(
            currentPage,
            // {
            //     pollingInterval: 60000,
            //     refetchOnFocus: true,
            //     refetchOnMountOrArgChange: true,
            // },
        );
    const [deleteUser] = useDeleteUserMutation();
    const [deactivateUser] = useDeactivateUserMutation();

    const deactivateUserHandler = async (id: string) => {
        // console.log(id);
        try {
            await deactivateUser(id).unwrap();
            toast.success('User deactivated');
            refetch();
        } catch (err: any) {
            const message = err.data.message || 'Error deactivate';
            toast.error(message);
        }
    };

    const deleteHandler = async (id: User) => {
        try {
            if (window.confirm('Are you sure you want to delete this user?')) {
                await deleteUser(id);
                toast.success('User deleted successfully');
                refetch();
            }
        } catch (err: any) {
            const message = err.data.message || 'Error deactivate';
            toast.error(message);
        }
    };

    useEffect(() => {
        if (isError) {
            const message = (error as MyError).data.message;
            toast.error(message);
        }
    }, [error, isError]);

    // console.log(data);
    const rows = data?.users || [];

    console.log(rows);

    return (
        <>
            <Breadcrumbs lastParent={'All Users'} />
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
                                <h1 className="text-center">
                                    Users Count {data?.count}
                                </h1>
                                <Table
                                    striped
                                    bordered
                                    hover
                                    responsive
                                    className="table-sm my-2"
                                >
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>isEmailVerified</th>
                                            <th>Join</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <>
                                                <tr key={index}>
                                                    <td>{row.email}</td>
                                                    <td>{row.username}</td>
                                                    <td>
                                                        {row.roles?.join(', ')}
                                                    </td>
                                                    <td>
                                                        {row?.isEmailVerified.toString()}
                                                    </td>
                                                    <td>
                                                        {format(
                                                            new Date(
                                                                row.createdAt,
                                                            ),
                                                            'MMMM dd, yyyy',
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="switch"
                                                            id={`user-status-${row._id}`}
                                                            label={
                                                                row.active
                                                                    ? 'Active'
                                                                    : 'Deactivated'
                                                            }
                                                            checked={row.active}
                                                            onChange={() =>
                                                                deactivateUserHandler(
                                                                    row._id,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() =>
                                                                deleteHandler(
                                                                    row?._id,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-between align-items-center">
                                    <PaginationProperties
                                        pages={data?.numberOfPages || 1}
                                        page={currentPage}
                                        isAdmin={false}
                                    />
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminAllUsers;
