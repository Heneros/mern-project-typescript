import baseApiSlice from 'features/api/baseApiSlice';

export const chatsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllChats: builder.query({
            query: () => ({
                url: `messages/users`,
            }),
            providesTags: ['Chat'],
        }),
        getIdChat: builder.query({
            query: (id) => ({
                url: `messages/${id}`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),
        sendMessageChat: builder.mutation({
            query: ({ id, text, image }) => ({
                url: `messages/send/${id}`,
                method: 'POST',
                body: { text, image },
            }),
            invalidatesTags: ['Chat'],
        }),
    }),
});

export const {
    useGetAllChatsQuery,
    useGetIdChatQuery,
    useSendMessageChatMutation,
} = chatsApiSlice;
