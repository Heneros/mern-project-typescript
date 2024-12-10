import socket from 'app/socket';
import { useGetIdChatQuery } from 'features/chat/api/chatApiSlice';
import React, { useEffect, useState } from 'react';

const ChatMessage: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    const { data: chatId, isSuccess } = useGetIdChatQuery(selectedChat._id);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (isSuccess && chatId) {
            setMessages(chatId);
        }
    }, [isSuccess, chatId]);

    useEffect(() => {
        socket.emit('join_room', chatId);

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages: Message) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [chatId]);
    //

    //  console.log(messages);
    return (
        <>
            {messages ? (
                messages.map((item: Message) => <>{item.text}</>)
            ) : (
                <>No messages in chat</>
            )}
        </>
    );
};

export default ChatMessage;
