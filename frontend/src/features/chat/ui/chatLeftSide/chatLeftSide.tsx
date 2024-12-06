import React from 'react';

interface UserChat {
    _id: string;
    username: string;
    firstName: string;
    avatar: string;
}

interface ChatLeftSideProp {
    dataUserChat: UserChat[];
}

const ChatLeftSide: React.FC<ChatLeftSideProp> = ({ dataUserChat }) => {
    return (
        <ul>
            {dataUserChat ? dataUserChat?.map((item, index) => (
                <li>{item.username}</li>
            )): (<>No chats</>)}
        </ul>
    );
};

export default ChatLeftSide;
