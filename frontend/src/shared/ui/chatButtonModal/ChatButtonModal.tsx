import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import './chatButtonModal.css';
const ChatButtonModal = () => {
    return (
        <div className="chatBtnModal">
            <button className="btnChatModal">
                <IoChatbubbleEllipsesOutline size={45} />
            </button>
        </div>
    );
};

export default ChatButtonModal;
