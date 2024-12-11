import React, { useRef, useState } from 'react';
import socket from 'app/socket';
import { useSendMessageChatMutation } from 'features/chat/api/chatApiSlice';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useGetUserProfileQuery } from 'features/user/userApiSlice';

const ChatInput: React.FC<ChatRoomProps> = ({ selectedChat }) => {
    // const { _id } = selectedChat;
    const { data: dataProfile, isSuccess } = useGetUserProfileQuery(undefined);
    const [text, setText] = useState<string | undefined>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [sendMessage] = useSendMessageChatMutation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = e.target.files?.[0];
        if (!file) {
            toast.error('No file selected');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setImagePreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text?.trim() && !imagePreview) return;

        const formData = new FormData();
        formData.append('text', text as string);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            await sendMessage({
                id: selectedChat._id,
                messageData: formData,
            });

            // console.log(selectedFile);
            // if (isSuccess) {
            //     const dataProfileSender = dataProfile?.userProfile._id;
            //     const messageData = {
            //         id: selectedChat._id,
            //         senderId: dataProfileSender,
            //         receiverId: selectedChat._id,
            //         text: text || null,
            //         image: imagePreview || null,
            //     };

            //     socket.emit('sendMessage', messageData);
            //     // console.log(messageData);
            // }

            setText('');
            setSelectedFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.log(error);
        }
    };
    // console.log('selectedChat', selectedChat);
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
