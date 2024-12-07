interface ChatModalProps {
    isOpen: boolean;
    closeModal: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

interface Message {
    _id: string;
    username: string;
}

interface ChatType {
    // readonly username: string;
    _id: string;
    setSelectedChat: () => void;
    
    onClick: () => void;
}

interface UserChat {
    _id: string;
    username: string;
    firstName: string;
    avatar: string;
    index: string;
    setSelectedChat: () => void;
    onClick: () => void;
}
