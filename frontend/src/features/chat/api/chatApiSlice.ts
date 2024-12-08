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
            query: ({ id, messageData }) => ({
                url: `messages/send/${id}`,
                method: 'POST',
                body: messageData,
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
