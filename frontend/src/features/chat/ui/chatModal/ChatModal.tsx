import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
    selectIsAuthenticated,
    setAuthenticated,
} from 'features/auth/authSlice';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { decodeToken } from 'react-jwt';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';
import ChatLeftSide from '../chatLeftSide/ChatLeftSide';
import { useGetAllChatsQuery } from 'features/chat/api/chatApiSlice';
import ChatRightSide from '../chatRightSide/ChatRightSide';

import '../styles/chatModal.css';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';
import socket from 'app/socket';
type User = {
    _id: string;
    username: string;
    avatar: string;
    status: 'online' | 'offline';
};
const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    closeModal,
    menuRef,
}) => {
    const { data: profileMy, isSuccess } = useGetUserProfileQuery(undefined);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const tokenArray = useAppSelector(selectCurrentUserToken);
    const tokenGithubArray = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGoogleArray = useAppSelector(selectCurrentUserGithubToken);

    const { data: dataUserChat } = useGetAllChatsQuery(undefined);
    const [onlineUsers, setOnlineUsers] = useState<UserChat[]>([]);

    useEffect(() => {
        const token: string | null = tokenArray ?? null;
        const tokenGithub: string | null = tokenGithubArray ?? null;
        const tokenGoogle: string | null = tokenGoogleArray ?? null;

        const decodedToken = token ? decodeToken(token) : null;
        const decodedGithubToken = tokenGithub
            ? decodeToken(tokenGithub)
            : null;
        const decodedGoogleToken = tokenGoogle
            ? decodeToken(tokenGoogle)
            : null;

        if (decodedToken || decodedGithubToken || decodedGoogleToken) {
            dispatch(setAuthenticated(true));
        } else {
            dispatch(setAuthenticated(false));
        }
    }, [tokenArray, tokenGithubArray, tokenGoogleArray]);

    useEffect(() => {
        const userId = profileMy?.userProfile?._id;

        if (isSuccess && userId) {
            socket.emit('setOnlineUser', userId);
        }
    }, [isSuccess, profileMy?.userProfile?._id]);

    useEffect(() => {
        const handleGetUsers = (usersWithStatus: User[]) => {
            setUsers(usersWithStatus);
        };

        socket.on('getUsers', handleGetUsers);

        return () => {
            socket.off('getUsers', handleGetUsers);
        };
    }, []);

    /// console.log(users);
    // console.log(onlineUsers);
    const handleClose = () => {
        closeModal();
    };

    return (
        <>
            <div ref={menuRef} className={`chatModal ${isOpen ? 'open' : ''}`}>
                <div className="chatModalContent">
                    <div className="chatModalHeader">
                        <h3>Chats</h3>
                        <button type="button" onClick={handleClose}>
                            <IoMdClose color={'red'} size={35} />
                        </button>
                    </div>
                    <div className="chatModalBody">
                        {isAuthenticated ? (
                            <>
                                <div className="leftSide">
                                    {users ? (
                                        users?.map((itemUser: ChatType) => (
                                            <>
                                                <ChatLeftSide
                                                    key={itemUser._id}
                                                    dataUserChat={itemUser}
                                                    setSelectedChat={
                                                        setSelectedChat
                                                    }
                                                />
                                            </>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="rightSide">
                                    {selectedChat ? (
                                        <ChatRightSide
                                            selectedChat={selectedChat}
                                        />
                                    ) : (
                                        <>Select Chat</>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>You are not authorize. Log in</>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatModal;
