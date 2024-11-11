import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { decodeToken } from 'react-jwt';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'shared/lib/store';

interface DecodedToken {
    id: string;
    roles: string[];
}

const NavMenu = () => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const location = useLocation();

    const isCurrentPath = (path: string) => location.pathname === path;

    let isAdmin = false;
    let isEditor = false;

    if (token) {
        const decodedToken = decodeToken<DecodedToken>(token);
        console.log(decodedToken);
        if (decodedToken) {
            const { roles } = decodedToken;
            isAdmin = roles.includes('Admin');
            isEditor = roles.includes('Editor');
        }
    } else if (tokenGithub) {
        const decodedToken = decodeToken<DecodedToken>(tokenGithub);
        console.log(decodedToken);
        if (decodedToken) {
            const { roles } = decodedToken;
            isAdmin = roles.includes('Admin');
            isEditor = roles.includes('Editor');
        }
    } else if (tokenGoogle) {
        const decodedToken = decodeToken<DecodedToken>(tokenGoogle);
        console.log(decodedToken);
        if (decodedToken) {
            const { roles } = decodedToken;
            isAdmin = roles.includes('Admin');
            isEditor = roles.includes('Editor');
        }
    } else {
        console.log('Nety');
    }

    return (
        <Col md={3}>
            <Nav className="flex-column profile-menu">
                <Nav.Link
                    className={
                        isCurrentPath('/personal-account') ? 'active' : ''
                    }
                    href="/personal-account"
                >
                    My profile
                </Nav.Link>
                <Nav.Link
                    className={
                        isCurrentPath('/personal-account/all-orders')
                            ? 'active'
                            : ''
                    }
                    href="/personal-account/all-orders"
                >
                    All Orders
                </Nav.Link>
                {isEditor && (
                    <>
                        <Nav.Link
                            className={
                                isCurrentPath('/admin/all-posts')
                                    ? 'active'
                                    : ''
                            }
                            href="/admin/all-posts"
                        >
                            All Posts
                        </Nav.Link>
                        <Nav.Link
                            className={
                                isCurrentPath('/admin/create-post')
                                    ? 'active'
                                    : ''
                            }
                            href="/admin/create-post"
                        >
                            Create Post
                        </Nav.Link>
                    </>
                )}
                {isAdmin && (
                    <>
                        <Nav.Link
                            className={
                                isCurrentPath('/admin/all-users')
                                    ? 'active'
                                    : ''
                            }
                            href="/admin/all-users"
                        >
                            All Users
                        </Nav.Link>
                    </>
                )}
            </Nav>
        </Col>
    );
};

export default NavMenu;
