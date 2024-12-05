import React, { useEffect, useRef, useState } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import './chatButtonModal.css';
import ChatModal from 'widgets/chatModal/chatModal';
const ChatButtonModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const closeModal = (): void => {
        setIsOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                closeModal();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    return (
        <>
            <div className="chatBtnModal" onClick={toggleModal}>
                <button className="btnChatModal">
                    <IoChatbubbleEllipsesOutline size={45} />
                </button>
            </div>
            <ChatModal
                menuRef={menuRef}
                isOpen={isOpen}
                closeModal={closeModal}
            />
        </>
    );
};

export default ChatButtonModal;
