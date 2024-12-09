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
    username: string;
    status: string;
    // setSelectedChat: () => void;
    // onClick: () => void;
}

interface ChatRoomProps {
    selectedChat: ChatType;
}

interface UserChat {
    _id: string;
    username: string;
    avatar: string;
    status: 'online' | 'offline';
    // index: string;
    // setSelectedChat: () => void;
    // onClick: () => void;
}
