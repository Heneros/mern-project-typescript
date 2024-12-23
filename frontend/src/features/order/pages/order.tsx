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
    Spinner,
    Tab,
    Table,
} from 'react-bootstrap';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import {
    useCreateCheckoutSessionMutation,
    useCreateStripeIntentMutation,
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
import {
    CardElement,
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import StripeCheckout from 'widgets/stripeCheckout/StripeCheckout';
import { loadStripe } from '@stripe/stripe-js';
const stripe = loadStripe(process.env.STRIPE_PUBLIC!);

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStripeReady, setIsStripeReady] = useState(false);
    const [isReady, setIsReady] = useState(false);

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
    const [
        createStripeIntent,
        { isLoading: loadingStripe, error: errorStripeInt },
    ] = useCreateStripeIntentMutation();
    const stripe = useStripe();
    const elements = useElements();
    const [createCheckoutSession, { isLoading: stripeLoading }] =
        useCreateCheckoutSessionMutation();

    useEffect(() => {
        if (stripe && elements) {
            setIsStripeReady(true);
        }
    }, [stripe, elements]);
    const handleCardChange = (event) => {
        setIsStripeReady(event.complete);
    };

    const handleStripePayment = async () => {
        if (!stripe || !elements) {
            toast.error('Stripe has not loaded');
            return;
        }
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            toast.error('Card element not found');
            return;
        }

        setIsProcessing(true);

        try {
            const { clientSecret } = await createStripeIntent({
                amount: totalPrice,
                orderId: _id,
            }).unwrap();

            if (!clientSecret || clientSecret.length === 0) {
                toast.error('Error: Client secret is empty');
                throw new Error('Failed to get client secret');
            }
            console.log(clientSecret);

            const paymentResult = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                },
            );
            if (paymentResult.error) {
                toast.error(paymentResult.error.message);
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                await payOrder({
                    orderId: _id,
                    details: orderItems,
                });

                refetch();
                toast.success('Payment successful');
            }
            // const { clientSecret } = await createIntentResponse;
            // console.log(createIntentResponse);
            // toast.success('Success');
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };
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
                    details,
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

    const isLoading = loadingPay || myOrderByIdLoading;
    const error = errorOrder;

    if (myOrderByIdLoading) return <Spinner animation="border" />;
    if (errorOrder) return <Alert variant="danger">Error loading order</Alert>;
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
                                            <>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                                <h5>Pay with Stripe</h5>{' '}
                                                <ListGroup.Item>
                                                    <div className="stripe-payment-container">
                                                        {loadingStripe ? (
                                                            <Spinner />
                                                        ) : errorStripeInt ? (
                                                            <>
                                                                {renderError(
                                                                    errorStripeInt,
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div>
                                                                    <CardElement
                                                                        onChange={
                                                                            handleCardChange
                                                                        }
                                                                    />
                                                                </div>
                                                                <Button
                                                                    className="mt-3"
                                                                    onClick={
                                                                        handleStripePayment
                                                                    }
                                                                    disabled={
                                                                        !isStripeReady ||
                                                                        isProcessing
                                                                    }
                                                                >
                                                                    {isProcessing
                                                                        ? 'Processing...'
                                                                        : 'Pay Now'}
                                                                </Button>
                                                            </>
                                                        )}
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
