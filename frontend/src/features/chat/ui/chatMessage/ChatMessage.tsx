import socket from 'app/socket';
import { useGetIdChatQuery } from 'features/chat/api/chatApiSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';

const ChatMessage: React.FC<ChatRoomProps> = ({ selectedChat, userId }) => {
    const { data: chatId, isSuccess } = useGetIdChatQuery(selectedChat._id);
    const { data: dataProfile } = useGetUserProfileQuery(undefined);

    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isSuccess && chatId) {
            setMessages(chatId);
        }
    }, [isSuccess, chatId]);

    const handleReceiveMessage = useCallback(
        (newMessage: Message) => {
            // console.log('Received message:', newMessage);
            // console.log('Current selected chat:', selectedChat._id);
            // console.log('New message receiver ID:', newMessage.receiverId);
            // console.log('Current user ID:', userId);

            if (
                newMessage.receiverId === userId ||
                newMessage.senderId === userId
            ) {
                setMessages((prevMessages) => {
                    const messageExists = prevMessages.some(
                        (msg) => msg._id === newMessage._id,
                    );

                    return messageExists
                        ? prevMessages
                        : [...prevMessages, newMessage];
                });
            }
        },
        [userId, selectedChat._id],
    );

    useEffect(() => {
        socket.on('newMessage', handleReceiveMessage);

        return () => {
            socket.off('newMessage', handleReceiveMessage);
        };
    }, [handleReceiveMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <div className="listMsg">
                {messages ? (
                    messages?.map((item: Message, index) => {
                        const isSendByUser = item.receiverId === userId;
                        return (
                            <div
                                ref={messageEndRef}
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
