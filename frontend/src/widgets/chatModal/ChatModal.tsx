import {
    selectCurrentUserGithubToken,
    selectCurrentUserGoogleToken,
    selectCurrentUserToken,
    selectIsAuthenticated,
} from 'features/auth/authSlice';
import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from 'shared/lib/store';

const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    closeModal,
    menuRef,
}) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const tokenArray = useAppSelector(selectCurrentUserToken);
    const tokenGithubArray = useAppSelector(selectCurrentUserGoogleToken);
    const tokenGoogleArray = useAppSelector(selectCurrentUserGithubToken);

    useEffect(() => {
        const token: string | null = tokenArray ?? null;
        const tokenGithub: string | null = tokenGithubArray ?? null;
        const tokenGoogle: string | null = tokenGoogleArray ?? null;
    });

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
                        <div className="leftChat"></div>
                        <div className="rightChat"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatModal;
