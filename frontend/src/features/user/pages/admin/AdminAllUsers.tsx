import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
    useDeactivateUserMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
} from 'features/user/userApiSlice';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Loader } from 'shared/ui/Loader';
import { Message } from 'shared/ui/Message';
import { renderError } from 'shared/utils/renderError';
import NavMenu from 'widgets/navMenu/ui/NavMenu';

const AdminAllUsers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery(
        'allUsersList',
        {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
        },
    );
    const [deleteUser] = useDeleteUserMutation();
    const [deactivateUser] = useDeactivateUserMutation();

    const rows = data?.users;

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const deactivateUserHandler = async (id: number) => {
        try {
            await deactivateUser(id).unwrap();
            toast.success('User deactivated');
        } catch (err: any) {
            const message = err.data.message;
            toast.error(message);
        }
    };

    const deleteHandler = async (id: User) => {
        try {
            if (window.confirm('Are you sure you want to delete this user?')) {
                await deleteUser(id.toString());
                toast.success('User deleted successfully');
            }
        } catch (err: any) {
            const message = err.data.message;
            toast.error(message);
        }
    };

    useEffect(() => {
        if (isError) {
            const message = (error as MyError).data.message;
            toast.error(message);
        }
    }, [error, isError]);

    console.log(data);

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
                                        {isSuccess &&
                                        rows &&
                                        rows.length > 0 ? (
                                            rows
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage +
                                                        rowsPerPage,
                                                )
                                                .map((row) => (
                                                    <>
                                                        <tr key={row._id}>
                                                            <td>{row.email}</td>
                                                            <td>
                                                                {row.username}
                                                            </td>
                                                            <td>
                                                                {row.roles?.join(
                                                                    ' ',
                                                                )}
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
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() =>
                                                                        deactivateUserHandler(
                                                                            row?.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() =>
                                                                        deleteHandler(
                                                                            row?.id,
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
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
