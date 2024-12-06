import baseApiSlice from 'features/api/baseApiSlice';

export const propertiesApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProperties: builder.query({
            query: (pageNumber = 1) => `/property/?page=${pageNumber}`,
            providesTags: ['Property'],
        }),
        createProperty: builder.mutation({
            query: (propertyInfo) => ({
                url: '/property/create',
                method: 'POST',
                credentials: 'include',
                body: propertyInfo,
            }),
            invalidatesTags: ['Property'],
        }),
        getSingleProperty: builder.query({
            query: (propertyId) => `/property/${propertyId}`,
            providesTags: ['Property'],
        }),
        updateProperty: builder.mutation({
            query: ({ id, ...otherFields }) => ({
                url: `/property/${id}`,
                method: 'PATCH',
                body: otherFields,
                credentials: 'include',
            }),
            invalidatesTags: ['Property'],
        }),
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/property/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Property'],
        }),
    }),
});

export const {
    useGetAllPropertiesQuery,
    useGetSinglePropertyQuery,
    useCreatePropertyMutation,
    useDeletePropertyMutation,
    useUpdatePropertyMutation,
} = propertiesApiSlice;
