import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import {
    useAddOrderItemMutation,
    useGetMyOrderByIdQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from '../api/order';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { formatPrice } from 'shared/utils/cartFunctions';
import { PostInfo } from 'shared/types';

const Order = () => {
    const { id } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error: errorOrder,
    } = useGetMyOrderByIdQuery(id);

    const {
        _id,
        paymentMethod,
        createdAt,
        isPaid,
        itemsPrice,
        orderItems,
        taxPrice,
        totalPrice,
        user,
    } = order?.order || {};
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,
    } = useGetPaypalClientIdQuery(undefined);
    const { userInfo } = useAppSelector((state) => state.auth);

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
    // const [payOrder, {isLoading: loadingPay}] = usePayO


    
  function onApprove(data, actions) {
      return actions.order.capture().then(async function (details) {
          try {
              await payOrder({ orderId, details });
              refetch();
              toast.success('Payment successful');
          } catch (err) {
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
                            //   value: totalPrice,
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

    return (
        <>
            <Breadcrumbs nameParent="Order" lastParent="Page of Order" />
            <Container>
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
                                    <Alert variant="success">{isPaid} </Alert>
                                ) : (
                                    <Alert variant="danger">Not Paid</Alert>
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
                                                <Col xs={5} md={1}>
                                                    <Image
                                                        src={item.preview}
                                                        alt={item.title}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col xs={12} md={8}>
                                                    <Link
                                                        to={`/post/${item?._id}`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    {formatPrice(item.price)} ={' '}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ),
                                )
                            )}
                        </ListGroup>
                    </Col>
                    <Col md={5}>
                        {order?.order?.totalPrice ? (
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                            />
                        ) : (
                            <div>Loading payment details...</div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Order;
