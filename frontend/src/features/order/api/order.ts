import baseApiSlice from 'features/api/baseApiSlice';
import { ORDER_URL } from 'shared/consts/urls';

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
        updateOrderToPaid: builder.mutation({
            query: (id) => ({
                url: `${ORDER_URL}/${id}/pay`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useAddOrderItemMutation,
    useGetMyOrderQuery,
    useGetMyOrderByIdQuery,
    useUpdateOrderToPaidMutation,
} = orderApiSlice;
