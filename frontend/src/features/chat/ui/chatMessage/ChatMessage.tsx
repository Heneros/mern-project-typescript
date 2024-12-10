import socket from 'app/socket';
import { useGetIdChatQuery } from 'features/chat/api/chatApiSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';

const ChatMessage: React.FC<ChatRoomProps> = ({ selectedChat, userId }) => {
    const { data: chatId, isSuccess } = useGetIdChatQuery(selectedChat._id);
    const { data: dataProfile } = useGetUserProfileQuery(undefined);

    // console.log('messages', selectedChat._id);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isSuccess && chatId) {
            setMessages(chatId);
        }
    }, [isSuccess, chatId]);

    const handleReceiveMessage = useCallback((message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log('Received message:', message);
    }, []);

    useEffect(() => {
        if (selectedChat._id) {
            socket.emit('join_room', selectedChat._id);
            // socket.on('receiveMessage', handleReceiveMessage);
        }
        socket.on('receiveMessage', (message) => {
            console.log(message);
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [chatId]);
    //
    // console.log('userId', userId);

    return (
        <>
            <div className="listMsg">
                {messages ? (
                    messages?.map((item: Message, index) => {
                        const isSendByUser = item.receiverId === userId;
                        return (
                            <div className="chat-message">
                                <div
                                    key={item._id || index}
                                    className={`message ${isSendByUser ? 'received' : 'sent'} `}
                                >
                                    {item.text ? (
                                        <>
                                            <span> {item.text}</span>
                                        </>
                                    ) : null}
                                    {item.image ? (
                                        <>
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="msgImg"
                                            />
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <>No messages in chat</>
                )}
            </div>
        </>
    );
};

export default ChatMessage;
