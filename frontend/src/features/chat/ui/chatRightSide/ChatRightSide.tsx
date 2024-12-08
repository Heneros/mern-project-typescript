import React from 'react';
import ChatHeader from '../chatHeader/ChatHeader';
import ChatMessage from '../chatMessage/ChatMessage';
import ChatInput from '../chatInput/chatInput';

const ChatRightSide: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    // const { _id } = selectedChat;
    // console.log(_id);

    return (
        <>
            {selectedChat ? (
                <div className="chatRoom">
                    <ChatHeader selectedChat={selectedChat} />
                    <ChatMessage selectedChat={selectedChat} />
                    <ChatInput selectedChat={selectedChat} />
                </div>
            ) : (
                <>No chat found</>
            )}
        </>
    );
};

export default ChatRightSide;
