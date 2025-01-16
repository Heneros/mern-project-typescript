// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// interface ChatState {
//     messages: any[];
//     selectedUser: any | null;
//     senderId?: string;
// }

// const initialState: ChatState = {
//     messages: [],
//     selectedUser: null,
// };
// export const chatSlice = createSlice({
//     name: 'chat',
//     initialState,
//     reducers: {
//         setMessages(state, action: PayloadAction<any[]>) {
//             state.messages = action.payload;
//         },
//         addMessage(state, action: PayloadAction<any>) {
//             state.messages.push(action.payload);
//         },
//         setSelectedUser(state, action: PayloadAction<any>) {
//             state.selectedUser = action.payload;
//         },
//         subscribeToMessages(state, action) {
//             const { socket, selectedUser } = action.payload;

//             if (!selectedUser) return;

//             socket.on('newMessage', (newMessage: ChatState) => {
//                 if (newMessage.senderId === selectedUser._id) {
//                     state.messages.push(newMessage);
//                 }
//             });
//         },
//         unsubscribeFromMessages(state, action) {
//             const { socket } = action.payload;
//             socket.off('newMessage');
//         },
//     },
// });
// export const {
//     setMessages,
//     addMessage,
//     setSelectedUser,
//     subscribeToMessages,
//     unsubscribeFromMessages,
// } = chatSlice.actions;

// export default chatSlice.reducer;
