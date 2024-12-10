import socket from 'app/socket';
import { useGetIdChatQuery } from 'features/chat/api/chatApiSlice';
import React, { useEffect, useState } from 'react';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';

const ChatMessage: React.FC<ChatRoomProps> = ({ selectedChat, userId }) => {
    const { data: chatId, isSuccess } = useGetIdChatQuery(selectedChat._id);
    const { data: dataProfile } = useGetUserProfileQuery(undefined);

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isSuccess && chatId) {
            setMessages(chatId);
        }
    }, [isSuccess, chatId]);

    useEffect(() => {
        if (selectedChat._id) {
            socket.emit('join_room', selectedChat._id);
        }

        return () => {
            socket.off('receiveMessage');
        };
    }, [chatId]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            console.log(message);
            if (message.id === selectedChat._id) {
                setMessages((prevMessages) => [...prevMessages, message]);
            } else {
                console.log('setMessages error');
            }
        });
        return () => {
            socket.off('receiveMessage');
        };
    });
    //
    // console.log('userId', userId);
    console.log('messages', messages);
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
