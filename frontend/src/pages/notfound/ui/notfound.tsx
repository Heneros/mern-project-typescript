import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHeartBroken, FaSadTear } from 'react-icons/fa';

export const NotFound = () => {
    return (
        <Container
            fluid
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: '94vh' }}
        >
            <Row className="text-center">
                <Col>
                    <h1 style={{ fontSize: '10rem', marginTop: '14rem' }}>
                        404 Not Found
                    </h1>
                </Col>
            </Row>
            <Row className="text-center">
                <Col>
                    <FaHeartBroken size="5rem" className="m-2" />
                    <FaSadTear size="5rem" className="m-2" />
                </Col>
            </Row>
        </Container>
    );
};
