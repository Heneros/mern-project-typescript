import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BASE_URL } from 'shared/consts/urls';


export const GoogleAuth = () => {
    const google = () => {
        window.open(`${BASE_URL}/api/v1/auth/google`, '_self');
    };
    return (
        <span style={{ cursor: 'pointer' }} onClick={google}>
            <FcGoogle  size={30} className="google-icon" />
        </span>
    );
};
