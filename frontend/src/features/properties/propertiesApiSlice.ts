import  baseApiSlice  from 'features/api/baseApiSlice';


export const propertiesApiSlice = baseApiSlice.injectEndpoints({
endpoints:(builder) =>({
    getAllProperties: builder.query({
        query: (page = 1) => `/property/all?page=${page}`,
        providesTags: ["Property"]
    }),
    createProperty: builder.mutation({
        query: (propertyInfo) =>({ 
            url: '/property/create',
            method: 'POST',
            body:propertyInfo
        }),
        invalidatesTags: ["Property"]
    }),
    getSingleProperty: builder.query({
        query:(propertyId) => `/property/${propertyId}`,
        providesTags: ["Property"]
    }),
    updateProperty: builder.mutation({
         query: (id, ...otherFields) =>({ 
            url: `/property/${id}`,
            method: 'PATCH',
            body:otherFields
        }),
        invalidatesTags: ["Property"]
    }),
    deleteProperty: builder.mutation({
        query:(id) =>({
            url: `/property/${id}`,
            method: 'DELETE'
        }),
        invalidatesTags: ["Property"]
    })
})
})