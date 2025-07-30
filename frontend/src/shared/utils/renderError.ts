/* @ts-ignore */
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const renderError = (error: FetchBaseQueryError | SerializedError | undefined) => {
    if (error) {
        if ('status' in error) {
            const fetchError = error as FetchBaseQueryError;
            return `Error: ${fetchError.status} - ${JSON.stringify(fetchError.data)}`;
        } else {
            return `Error: ${(error as SerializedError).message}`;
        }
    }
    return 'An unknown error occurred';
};
