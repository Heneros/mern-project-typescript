import React from 'react';
import { useAuthUser } from './useAuthUser';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface AuthRequiredProps {
    allowedRoles: string[];
}
export const AuthRequired: React.FC<AuthRequiredProps> = ({ allowedRoles }) => {
    const location = useLocation();
    const authUser = useAuthUser();

    if (!authUser) {
        <Navigate to="/login" state={{ from: location }} replace />;
    }
    return authUser?.roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};
