import React, { FormEvent, useState } from 'react';
import { Button, Col, Container, Form, Row, Tab, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import { PostInfo } from 'shared/types';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { updatePaymentMethod } from '../api/cartSlice';

const PaymentMethod = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [paymentMethod, setPaymentMethod] = useState('Paypal');

    const handleChangePayment = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(updatePaymentMethod(paymentMethod));
        navigate(`/place-order`);
    };
    return (
        <>
            <Breadcrumbs />
            <Container className="py-3 my-3 border border-2 rounded-4">
                <Row className="justify-content-center mb-3">
                    <Col className="d-flex justify-content-center align-items-center">
                        <h1>Payment Methods </h1>
                    </Col>
                </Row>
                <Form onSubmit={handleChangePayment}>
                    <Form.Group controlId="paymentMethod">
                        <Form.Label>Select Payment Method</Form.Label>

                        <Form.Check
                            type="radio"
                            label="Paypal"
                            name="paymentMethod"
                            value="Paypal"
                            defaultChecked
                            checked={paymentMethod === 'Paypal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="stripe">
                        <Form.Check
                            type="radio"
                            label="Stripe"
                            name="stripe"
                            value="Stripe"
                            defaultChecked
                            checked={paymentMethod === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="success">
                        Save Information
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default PaymentMethod;
