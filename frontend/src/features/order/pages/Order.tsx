import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Image,
    ListGroup,
    ListGroupItem,
    Row,
} from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import {
    useGetMyOrderByIdQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from '../api/orderApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { formatPrice } from 'shared/utils/cartFunctions';
import { PostInfo } from 'shared/types';
import { Loader } from 'shared/ui/Loader';
import { renderError } from 'shared/utils/renderError';

import StripeCheckout from 'widgets/stripeCheckout/StripeCheckout';
import PayPalPayment from 'widgets/payPalPayment/PayPalPayment';
import { handleError } from 'shared/utils/handleError';

const Order = () => {
    const { id } = useParams();
    const {
        data: order,
        refetch,
        isLoading: myOrderByIdLoading,
        error: errorOrder,
    } = useGetMyOrderByIdQuery(id);
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const {
        _id,
        paymentMethod,
        createdAt,
        isPaid,
        paidAt,
        orderItems,
        taxPrice,
        totalPrice,
        user,
    } = order?.order || {};

    const handlePaymentSuccess = async (details: any) => {
        try {
            const currentOrderId = _id;

            if (!currentOrderId) {
                toast.error('Order ID is missing');
                return;
            }

            await payOrder({
                data: {
                    orderId: currentOrderId,
                    updateTime: new Date().toISOString(),
                    paymentId: 'PAYMENT_ID_FROM_PAYPAL',
                    paymentStatus: 'COMPLETED',
                    payerEmail: user.email,
                },
            });

            refetch();
            toast.success('Payment successful');
        } catch (err) {
            // console.error('Payment Error:', err);
            // toast.error(err?.data?.message || err.message);
            const errorMessage = handleError(error);
            toast.error(errorMessage || 'Error payment payOrder');
        }
    };

    const isLoading = loadingPay || myOrderByIdLoading;
    const error = errorOrder;

    return (
        <>
            <Breadcrumbs nameParent="Order" lastParent="Page of Order" />
            <Container>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Alert variant="danger">{renderError(error)}</Alert>
                ) : (
                    <>
                        {' '}
                        <Row className="text-center border p-3 my-2">
                            <Col>
                                <h2> Order #{_id}</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={7}>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <h5>Payment Method:</h5>
                                        {paymentMethod}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {isPaid ? (
                                            <Alert variant="success">
                                                Paid{' '}
                                                {format(
                                                    new Date(paidAt),
                                                    'MMMM dd, yyyy HH:mm',
                                                )}
                                            </Alert>
                                        ) : (
                                            <Alert variant="danger">
                                                Not Paid
                                            </Alert>
                                        )}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <h5>Order Items</h5>
                                    </ListGroup.Item>
                                    {orderItems?.length === 0 ? (
                                        <ListGroup.Item>
                                            <small className="text-muted">
                                                Order is empty
                                            </small>
                                        </ListGroup.Item>
                                    ) : (
                                        orderItems?.map(
                                            (item: PostInfo, index: string) => (
                                                <ListGroup.Item key={index}>
                                                    <Row className="align-items-center text-center">
                                                        <Col xs={6} md={2}>
                                                            <Image
                                                                src={
                                                                    item.preview
                                                                }
                                                                alt={item.title}
                                                                fluid
                                                                rounded
                                                            />
                                                        </Col>
                                                        <Col xs={12} md={7}>
                                                            <Link
                                                                to={`/post/${item?.property}`}
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        </Col>
                                                        <Col xs={11} md={3}>
                                                            {formatPrice(
                                                                item.price,
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ),
                                        )
                                    )}
                                    <ListGroup.Item>
                                        <strong>Tax Price:</strong>

                                        <strong>
                                            {' '}
                                            {formatPrice(taxPrice)}{' '}
                                        </strong>
                                        <hr />

                                        <strong>Total Price:</strong>

                                        <strong>
                                            {' '}
                                            {formatPrice(totalPrice)}{' '}
                                        </strong>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={5}>
                                <ListGroup>
                                    <ListGroup.Item>
                                        Order created :{' '}
                                        {createdAt &&
                                        !isNaN(new Date(createdAt).getTime())
                                            ? format(
                                                  new Date(createdAt),
                                                  'MMMM dd, yyyy',
                                              )
                                            : 'Invalid date'}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        {!isPaid ? (
                                            <>
                                                <PayPalPayment
                                                    orderId={_id}
                                                    totalPrice={totalPrice}
                                                    isPaid={isPaid}
                                                    onPaymentSuccess={
                                                        handlePaymentSuccess
                                                    }
                                                />
                                                <h5>Pay with Stripe</h5>{' '}
                                                <ListGroup.Item>
                                                    <div className="stripe-payment-container">
                                                        <StripeCheckout
                                                            _id={_id}
                                                            orderItems={
                                                                orderItems
                                                            }
                                                            user={user}
                                                        />
                                                    </div>
                                                </ListGroup.Item>
                                            </>
                                        ) : (
                                            <Alert variant="success">
                                                Order payed
                                            </Alert>
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </>
    );
};

export default Order;
