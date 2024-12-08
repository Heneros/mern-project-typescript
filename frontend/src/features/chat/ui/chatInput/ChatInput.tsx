import React, { useRef, useState } from 'react';
import socket from 'app/socket';
import { useSendMessageChatMutation } from 'features/chat/api/chatApiSlice';
import { Button, Form } from 'react-bootstrap';

const ChatInput: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    // const { _id } = selectedChat;
    const [text, setText] = useState<string | undefined>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef(null);
    const [sendMessage] = useSendMessageChatMutation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            console.log('No file selected');
            return;
        }
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text?.trim() && !imagePreview) return;

        // const formData = new FormData();

        // if (selectedFile) {
        //     formData.append('image', selectedFile);
        // }

        try {
            await sendMessage({
                id: selectedChat._id,
                text,
                image: imagePreview,
            });

            console.log({ text, imagePreview });
            setText('');
            setImagePreview(null);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="message-input">
            {imagePreview && (
                <div className="containerPreview">
                    <img src={imagePreview} alt="" />
                </div>
            )}
            <Form onSubmit={handleSendMessage}>
                <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Form.Control
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
                <Button className="btn btn-success" type="submit">
                    Submit Message
                </Button>
            </Form>
        </div>
    );
};

export default ChatInput;
