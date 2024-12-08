import React from 'react';

const ChatHeader: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    const { _id, username } = selectedChat;

    // console.log(_id);
    // console.log(username);
    return <div>{username}</div>;
};

export default ChatHeader;
