import clsx from 'clsx';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Footer = ({ className }: { className?: string }) => {
    return (
        <footer>
            <Container>
                <div className={clsx('col-lg-8', className)}>
                    <p>
                        Copyright © 2048 Villa Agency Co., Ltd. All rights
                        reserved. Design:{' '}
                        <Link
                            rel="nofollow"
                            to="https://templatemo.com"
                            target="_blank"
                        >
                            TemplateMo
                        </Link>
                    </p>
                </div>
            </Container>
        </footer>
    );
};
