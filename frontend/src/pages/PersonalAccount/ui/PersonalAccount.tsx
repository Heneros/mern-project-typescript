import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import NavMenu from 'widgets/navMenu/ui/NavMenu';
import { Breadcrumbs } from 'shared/ui/Breadcrumbs';
import { Col, Container, Row } from 'react-bootstrap';

export const PersonalAccount = () => {
    return (
        <>
            <Breadcrumbs />
            <Container>
                <Row>
                    <NavMenu />
                </Row>
                <Row>
                    <Col md={9}>
                    
                    </Col>
                </Row>
            </Container>
        </>
    );
};
