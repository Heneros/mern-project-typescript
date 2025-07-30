import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useUserRoles } from 'shared/hooks/useUserRoles';
import './NavMenu.css';

export const NavMenu = () => {
    const location = useLocation();

    const isCurrentPath = (path: string) => location.pathname === path;
    const { isAdmin, isEditor, userId } = useUserRoles();

    return (
        <Nav className="flex-column profile-menu">
            <Nav.Link
                className={isCurrentPath('/personal-account') ? 'active' : ''}
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
                            isCurrentPath('/admin/all-posts') ? 'active' : ''
                        }
                        href="/admin/all-posts"
                    >
                        All Posts
                    </Nav.Link>
                    <Nav.Link
                        className={
                            isCurrentPath('/admin/create-post') ? 'active' : ''
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
                            isCurrentPath('/admin/all-users') ? 'active' : ''
                        }
                        href="/admin/all-users"
                    >
                        All Users
                    </Nav.Link>
                </>
            )}
        </Nav>
    );
};

