import React, { Dispatch, SetStateAction } from 'react';

interface ChatLeftSideProp {
    dataUserChat: ChatType;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
}

const ChatLeftSide: React.FC<ChatLeftSideProp> = ({
    dataUserChat,
    setSelectedChat,
}) => {
    const handleClick = () => {
        setSelectedChat(dataUserChat);
    };
    return (
        <>
            <div
                key={dataUserChat._id}
                className="parentItem"
                onClick={handleClick}
            >
                {dataUserChat.username}
                {/* {item.avatar} */}
            </div>
        </>
    );
};

export default ChatLeftSide;
