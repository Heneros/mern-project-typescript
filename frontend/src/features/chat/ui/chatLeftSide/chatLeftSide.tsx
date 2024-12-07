import React, { Dispatch, SetStateAction } from 'react';

interface ChatLeftSideProp {
    dataUserChat: UserChat;

    ///  setSelectedChat: Dispatch<SetStateAction<ChatType | null>>;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;

    onClick: () => void;
}

const ChatLeftSide: React.FC<ChatLeftSideProp> = ({
    dataUserChat,
    onClick,
}) => {

     
    return (
        <>
            <div
                key={dataUserChat._id}
                className="parentItem"
                onClick={onClick}
            >
                {dataUserChat.username}
                {/* {item.avatar} */}
            </div>
        </>
    );
};

export default ChatLeftSide;
