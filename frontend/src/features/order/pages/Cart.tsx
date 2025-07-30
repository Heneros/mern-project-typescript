import React from 'react';
import { Button, Col, Container, Row, Tab, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { PostInfo } from 'shared/types';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { clearCartItem, clearCartItems } from '../api/cartSlice';

const Cart = () => {
    const dispatch = useAppDispatch();
    const cart = useAppSelector((state) => state.cart);
    const navigate = useNavigate();
    const { cartItems } = cart;

    const handleRemoveItem = (id: string) => {
        dispatch(clearCartItem(id));
    };

    const handleRemoveAll = () => {
        dispatch(clearCartItems());
    };
    const handleNavigate = () => {
        navigate('/payment-method');
    };

    // console.log(cartItems);

    return (
        <>
            <Breadcrumbs />
            <Container className="py-3 my-3 border border-2 rounded-4">
                <Row className="justify-content-center mb-3">
                    <Col className="d-flex justify-content-center align-items-center">
                        <h1>Villas to order </h1>
                    </Col>
                </Row>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Preview</th>
                            <th>Title</th>
                            <th>City</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={item.preview}
                                            alt={item.title}
                                            style={{ maxWidth: '100px' }}
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/post/${item._id}`}>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td>{item.city}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleRemoveItem(item._id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No items in the cart
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Col className="d-flex justify-content-between my-4">
                    <Button
                        type="button"
                        variant="danger"
                        onClick={handleRemoveAll}
                    >
                        Remove all
                    </Button>
                    <div className=" d-flex flex-column text-right">
                        <strong>Tax Price: {cart.taxPrice} $</strong>
                        <strong>
                            Total Price(with taxes): {cart.totalPrice} $
                        </strong>
                    </div>
                </Col>
                <Col className="d-flex justify-content-end ">
                    <Button
                        type="button"
                        className="btn-lg"
                        onClick={handleNavigate}
                        variant="success"
                    >
                        Proceed to order
                    </Button>
                </Col>
            </Container>
        </>
    );
};

export default Cart;
