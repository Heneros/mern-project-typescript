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

        payOrder: builder.mutation({
            query: ({ data }) => ({
                url: `${ORDER_URL}/${data.orderId}/pay`,
                method: 'PUT',
                body: {
                    id: data.paymentId,
                    status: data.paymentStatus,
                    update_time: data.updateTime,
                    payer: {
                        email_address: data.payerEmail,
                    },
                },
            }),
            invalidatesTags: ['Order'],
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,
            }),
            keepUnusedDataFor: 5,
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
        createCheckoutSession: builder.mutation({
            query: ({ items, _id, user }) => ({
                url: `${ORDER_URL}/create-checkout-session`,
                method: 'POST',
                body: { items, _id, user },
            }),
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
