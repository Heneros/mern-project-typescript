import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
} from 'features/auth/authSlice';
import { useGetMyOrderByIdQuery } from 'features/order/api/orderApiSlice';
import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';
import { useAppSelector } from 'shared/lib/store';

interface DecodedToken {
    id: string;
}

interface CheckUserProps {
    orderId: string;
    children: React.ReactNode;
}

const CheckUser: React.FC<CheckUserProps> = ({ orderId, children }) => {
    const token = useAppSelector(selectCurrentUserToken);
    const tokenGoogle = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGithub = useAppSelector(selectCurrentUserGithubToken);

    const [userId, setUserId] = useState<string | null>(null);

    const { data: order, isLoading, error } = useGetMyOrderByIdQuery(orderId);
    useEffect(() => {
        if (token || tokenGoogle || tokenGithub) {
            const decodedToken = token
                ? decodeToken<DecodedToken>(token)
                : null;
            const decodedTokenGoogle = tokenGoogle
                ? decodeToken<DecodedToken>(tokenGoogle)
                : null;
            const decodedTokenGithub = tokenGithub
                ? decodeToken<DecodedToken>(tokenGithub)
                : null;

            const userToken =
                decodedToken?.id ||
                decodedTokenGoogle?.id ||
                decodedTokenGithub?.id;
            if (userToken) setUserId(userToken);
        }
    }, [token, tokenGoogle, tokenGithub]);

    if (isLoading) return <div>Loading...</div>;
    if (error || !order)
        return <div>Order not found or an error occurred.</div>;

    if (order.userId !== userId) {
        return <div>You are not authorized to view this order.</div>;
    }

    return <> {children} </>;
};

export default CheckUser;
