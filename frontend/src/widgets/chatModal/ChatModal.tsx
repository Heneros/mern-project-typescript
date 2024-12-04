import React from 'react';
import { IoMdClose } from 'react-icons/io';

interface ChatModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, closeModal }) => {
    const handleClose = () => {
        closeModal();
    };
    return (
        <>
            <div className={`chatModal ${isOpen ? 'open' : ''}`}>
                <div className="chatModalContent">
                    <div className="chatModalHeader">
                        <h3>Chats</h3>
                        <button type="button" onClick={handleClose}>
                            <IoMdClose color={'red'} />
                        </button>
                    </div>
 
                </div>
            </div>
        </>
    );
};

export default ChatModal;
