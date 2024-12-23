import baseApiSlice from 'features/api/baseApiSlice';
import { ORDER_URL, PAYPAL_URL, STRIPE_INTENT } from 'shared/consts/urls';

export const orderApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addOrderItem: builder.mutation({
            query: (newOrder) => ({
                url: `${ORDER_URL}`,
                method: 'POST',
                body: newOrder,
            }),
            invalidatesTags: ['Order'],
        }),
        getMyOrder: builder.query({
            query: () => ({
                url: `${ORDER_URL}`,
            }),
            providesTags: ['Order'],
        }),
        getMyOrderById: builder.query({
            query: (id) => ({
                url: `${ORDER_URL}/${id}`,
            }),
            providesTags: ['Order'],
        }),
        // updateOrderToPaid: builder.mutation({
        //     query: (id) => ({
        //         url: `${ORDER_URL}/${id}/pay`,
        //         method: 'PUT',
        //     }),
        //     invalidatesTags: ['Order'],
        // }),
        payOrder: builder.mutation({
            query: ({ data }) => ({
                url: `${ORDER_URL}/${data.orderId}/pay`,
                method: 'PUT',
                body: data.details,
            }),
            invalidatesTags: ['Order'],
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
        }),
        createCheckoutSession: builder.mutation<
            { url: string },
            { items: { priceId: string; quantity: number }[] }
        >({
            query: (body) => ({
                url: 'create-checkout-session',
                method: 'POST',
                body,
            }),
        }),
        createStripeIntent: builder.mutation({
            query: ({
                amount,
                orderId,
            }: {
                amount: number;
                orderId: string;
            }) => ({
                url: `${ORDER_URL}/create-payment-intent`,
                method: 'POST',
                body: { amount, orderId },
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useAddOrderItemMutation,
    useGetMyOrderQuery,
    useGetMyOrderByIdQuery,
    // useUpdateOrderToPaidMutation,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useCreateStripeIntentMutation,
    useCreateCheckoutSessionMutation,
} = orderApiSlice;
