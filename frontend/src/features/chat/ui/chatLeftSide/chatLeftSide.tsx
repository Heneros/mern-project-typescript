import socket from 'app/socket';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';
import React, { Dispatch, SetStateAction, useEffect } from 'react';

interface ChatLeftSideProp {
    dataUserChat: ChatType;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
}

const ChatLeftSide: React.FC<ChatLeftSideProp> = ({
    dataUserChat,
    setSelectedChat,
}) => {
    // const { data: profileMy, isSuccess } = useGetUserProfileQuery(undefined);
    /// const { _id } = profileMy?.userProfile;

    // console.log(userId);

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
                {dataUserChat.status}
                {dataUserChat.username}
                {/* {item.avatar} */}
            </div>
        </>
    );
};

export default ChatLeftSide;
