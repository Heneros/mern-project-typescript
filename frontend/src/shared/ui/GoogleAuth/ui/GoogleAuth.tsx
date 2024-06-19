import React from 'react';
import { FcGoogle } from 'react-icons/fc';

// http://localhost:1997/api/v1/auth/google

export const GoogleAuth = () => {
    const google = () => {
        window.open('http://localhost:1997/api/v1/auth/google', '_self');
    };
    return (
        <div style={{ cursor: 'pointer' }} onClick={google}>
            <FcGoogle className="google-icon" />
        </div>
    );
};
