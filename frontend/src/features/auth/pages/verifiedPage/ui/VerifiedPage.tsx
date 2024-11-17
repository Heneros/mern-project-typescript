import React from 'react';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Stack, Button, Row, Col } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <RouterLink ref={ref} {...props} />
));

Link.displayName = 'Link';

export const VerifiedPage: React.FC = () => {
    return (
        <Container
            className="py-3 my-3 border border-2 rounded-4"
            style={{ maxWidth: '540px' }}
        >
            <Stack direction="vertical" gap={3} className="text-center">
                <Row className="justify-content-center mb-3">
                    <Col
                        xs={12}
                        className="auto d-flex justify-content-center  "
                    >
                        <FaCheckCircle className="verified" size={50} />
                    </Col>
                </Row>
                <h2>Account Verified</h2>
                <h5>Your Account has been verified and is ready for use.</h5>
                <h5>An Email to confirm the same has been sent</h5>
                <Button
                    variant="primary"
                    as={Link}
                    to="/login"
                    className="auto d-flex justify-content-center align-items-center"
                >
                    <FontAwesomeIcon icon={faLockOpen} className="me-2" />
                    <span>Please login to use our service</span>
                </Button>
            </Stack>
        </Container>
    );
};
