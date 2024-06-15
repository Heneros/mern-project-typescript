import React, { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface MessageProps {
    variant?: string;
    children: ReactNode;
}
export const Message: React.FC<MessageProps> = ({
    variant = 'info',
    children,
}) => {
    return <Alert variant={variant}>{children}</Alert>;
};
Message.defaultProps = {
    variant: 'info',
};
