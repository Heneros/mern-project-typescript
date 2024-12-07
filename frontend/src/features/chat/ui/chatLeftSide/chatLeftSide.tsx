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
        <>
            {dataUserChat ? (
                dataUserChat?.map((item, index) => (
                    <div key={index} className="parentItem">
                        {item.username}
                        {item.avatar}
                    </div>
                ))
            ) : (
                <>No chats</>
            )}
        </>
    );
};

export default ChatLeftSide;
