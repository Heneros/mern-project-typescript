import React, { useState } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import './chatButtonModal.css';
import ChatModal from 'widgets/chatModal/chatModal';
const ChatButtonModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    return (
        <>
            <div className="chatBtnModal" onClick={toggleModal}>
                <button className="btnChatModal">
                    <IoChatbubbleEllipsesOutline size={45} />
                </button>
            </div>
            <ChatModal isOpen={isOpen} closeModal={closeModal} />
        </>
    );
};

export default ChatButtonModal;
