import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    ListGroup,
    ListGroupItem,
    Row,
    Tab,
    Table,
} from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { useAddOrderItemMutation } from '../api/order';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import { PostInfo } from 'shared/types';
import { formatPrice } from 'shared/utils/cartFunctions';
import { clearCartItems } from '../api/cartSlice';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const cart = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    const [addOrderItem, { isLoading, error: errorOrder }] =
        useAddOrderItemMutation();

    const { user: userInfo } = useAppSelector((state) => state.auth);

    const { cartItems } = cart;
    // console.log(cartItems.length);
    const placeOrderHandler = async () => {
        try {
            const res = await addOrderItem({
                user: userInfo._id,
                paypalOrderId: Date.now(),
                paymentMethod: cart.paymentMethod,
                orderItems: cart.cartItems,
            }).unwrap();

            dispatch(clearCartItems());
            navigate(`/order/${res.paypalOrderId}`);
        } catch (error) {
            console.log(error || errorOrder);
        }
    };
    return (
        <>
            <Breadcrumbs />
            <Container className="py-3 my-3 border border-2 rounded-4">
                <Row className="justify-content-center mb-3">
                    <Col className="d-flex justify-content-center align-items-center">
                        <h1>Make order </h1>
                    </Col>
                </Row>
                <Row className="gy-4">
                    <Col md={8}>
                        <ListGroup>
                            <ListGroupItem>
                                <h5>Payment Method</h5>
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </ListGroupItem>
                            <hr />
                            <ListGroup.Item>
                                <h5>Order Items</h5>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {cart.cartItems.length === 0 ? (
                                    <div>Your cart is empty</div>
                                ) : (
                                    <>
                                        <ListGroup>
                                            {cart?.cartItems.map(
                                                (
                                                    item: PostInfo,
                                                    index: string,
                                                ) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row className="align-items-center text-center">
                                                            <Col xs={5} md={2}>
                                                                <img
                                                                    src={
                                                                        item.preview
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="img-fluid rounded"
                                                                />
                                                            </Col>
                                                            <Col xs={7} md={6}>
                                                                <Link
                                                                    to={`/post/${item._id}`}
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                {formatPrice(
                                                                    item.price,
                                                                )}{' '}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ),
                                            )}
                                        </ListGroup>
                                    </>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <h3>Order Summary</h3>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>{cartItems.length}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${cart.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>${cart.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {/* {error && (
                                            <div className="text-danger">
                                                {error.data.message}
                                            </div>
                                        )} */}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {cart.paymentMethod === 'Stripe' ? (
                                            <Button>Stripe</Button>
                                        ) : (
                                            // <StripeButton
                                            //     userId={userInformationId}
                                            //     userEmail={userInformationEmail}
                                            //     cartItems={cartItems}
                                            // >
                                            //     Make a payment stripe
                                            // </StripeButton>
                                            <Button
                                                type="button"
                                                className="w-100"
                                                variant="primary"
                                                disabled={
                                                    cart.cartItems.length === 0
                                                }
                                                onClick={placeOrderHandler}
                                            >
                                                Place Order
                                            </Button>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PlaceOrder;
