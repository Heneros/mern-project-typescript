import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'shared/lib/store';

const NavMenu = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const location = useLocation();

    const isCurrentPath = (path: string) => location.pathname === path;
    return (
        <Col md={3}>
            <Nav className="flex-column profile-menu">
                <Nav.Link
                    className={isCurrentPath('/profile') ? 'active' : ''}
                    href="/personal-account"
                >
                    My profile
                </Nav.Link>
            </Nav>
        </Col>
    );
};

export default NavMenu;
