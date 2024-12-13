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
                className={`parentItem ${dataUserChat.status === 'online' ? 'online' : 'offline'}`}
                onClick={handleClick}
            >
                <div className="userAvatar">
                    <img
                        src={dataUserChat.avatar || '/default-avatar.png'}
                        // alt={`${dataUserChat.username}'s avatar`}
                    />
                </div>
                <div className="userInfo">
                    <span className="userName">{dataUserChat.username}</span>
                    <p className={`userStatus ${dataUserChat.status}`}>
                        {dataUserChat.status === 'online'
                            ? 'Online'
                            : 'Offline'}
                    </p>
                </div>
            </div>
        </>
    );
};

export default ChatLeftSide;
