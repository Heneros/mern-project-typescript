import React, { useEffect } from 'react';
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
    Tab,
    Table,
} from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import {
    useGetMyOrderByIdQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from '../api/orderApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { formatPrice } from 'shared/utils/cartFunctions';
import { PostInfo } from 'shared/types';
import { Loader } from 'shared/ui/loader';
import { Message } from 'shared/ui/message';
import { renderError } from 'shared/utils/renderError';
import { useAppSelector } from 'shared/lib/store';

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
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery(undefined);
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const {
        _id,
        paymentMethod,
        createdAt,
        isPaid,
        paidAt,
        itemsPrice,
        orderItems,
        taxPrice,
        totalPrice,
        user,
    } = order?.order || {};

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    },
                });

                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending',
                });
            };

            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                const currentOrderId = _id;

                if (!currentOrderId) {
                    toast.error('Order ID is missing');
                    return;
                }

                await payOrder({
      
                    orderId: currentOrderId,
                    details: {
                        id: details.id,
                        status: details.status,
                        update_time: details.update_time,
                        payer: {
                            email_address: details.payer.email_address,
                        },
                    },
                });

                refetch();
                toast.success('Payment successful');
            } catch (err) {
                console.error('Payment Error:', err);
                toast.error(err?.data?.message || err.message);
            }
        });
    }
    function createOrder(data, actions) {
        if (!isLoading && !errorOrder && totalPrice === undefined)
            if (!totalPrice) {
                toast.error('Total price is not defined');
                return Promise.reject(new Error('Total price is missing'));
            }
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: totalPrice,
                        },
                    },
                ],
            })
            .then((orderId) => {
                return orderId;
            });
    }
    function onError(err) {
        console.log(err.message);
        toast.error(err.message);
    }

    // const orderItem = order.order ?? [];
    const isLoading = loadingPay || myOrderByIdLoading;
    const error = errorOrder;

    return (
        <>
            <Breadcrumbs nameParent="Order" lastParent="Page of Order" />
            <Container>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{renderError(error)}</Message>
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
                                        {!loadingPayPal && !isPaid ? (
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            />
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
