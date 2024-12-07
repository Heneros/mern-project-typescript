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
    readonly username: string;
    readonly messages: Message[];
    setSelectedChat: (_id: string) => void;
    onClick: () => void;
}
