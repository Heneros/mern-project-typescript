import baseApiSlice from 'features/api/baseApiSlice';
import { UPLOAD_URL } from 'shared/consts/urls';

export const fileApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendImage: builder.mutation({
            query: ({ formData }) => ({
                url: `${UPLOAD_URL}`,
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            }),
        }),
    }),
});

export const { useSendImageMutation } = fileApiSlice;
