import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { Breadcrumbs } from 'shared/ui/breadcrumbs';
import {
    useAddOrderItemMutation,
    useGetMyOrderByIdQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from '../api/order';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const Order = () => {
    const { id } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error,
    } = useGetMyOrderByIdQuery(id);

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
    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: order.totalPrice,
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

    console.log(order);
    return (
        <>
            <Breadcrumbs nameParent="Order" lastParent="Page of Order" />
            <Container>
                <Row>
                    <Col className="text-center">
                        <h2> Order #{order?.order._id}</h2>
                    </Col>
                </Row>
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                ></PayPalButtons>
            </Container>
        </>
    );
};

export default Order;
