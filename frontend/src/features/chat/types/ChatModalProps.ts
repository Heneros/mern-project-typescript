interface ChatModalProps {
    isOpen: boolean;
    closeModal: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

interface ChatType {
    // readonly username: string;
    _id: string;
    username: string;
    avatar: string;
    status: string;
    // setSelectedChat: () => void;
    // onClick: () => void;
}

interface ChatRoomProps {
    selectedChat: ChatType;
    userId?: string;
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

interface Message {
    _id: string;
    text: string;
    senderId: string;
    receiverId: string;
    image: string;
    // setSelectedChat: () => void;
    // onClick: () => void;
}
