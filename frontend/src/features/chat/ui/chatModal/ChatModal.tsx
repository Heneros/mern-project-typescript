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
import './styles/chatModal.css';
import ChatLeftSide from '../chatLeftSide/ChatLeftSide';
import { useGetAllChatsQuery } from 'features/chat/api/chatApiSlice';
import ChatRightSide from '../chatRightSide/ChatRightSide';

const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    closeModal,
    menuRef,
}) => {
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const tokenArray = useAppSelector(selectCurrentUserToken);
    const tokenGithubArray = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGoogleArray = useAppSelector(selectCurrentUserGithubToken);

    const { data: dataUserChat } = useGetAllChatsQuery(undefined);

    useEffect(() => {
        const token: string | null = tokenArray ?? null;
        const tokenGithub: string | null = tokenGithubArray ?? null;
        const tokenGoogle: string | null = tokenGoogleArray ?? null;

        const decodedToken = token ? decodeToken(token) : null;
        // console.log(decodedToken);
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
                                    {dataUserChat ? (
                                        dataUserChat?.map(
                                            (itemUser: UserChat) => (
                                                <>
                                                    <ChatLeftSide
                                                        dataUserChat={itemUser}
                                                        setSelectedChat={
                                                            setSelectedChat
                                                        }
                                                        onClick={() =>
                                                            setSelectedChat(
                                                                itemUser,
                                                            )
                                                        }
                                                    />
                                                </>
                                            ),
                                        )
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
