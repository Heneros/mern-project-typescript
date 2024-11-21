import { useSendImageMutation } from 'features/uploadImage/uploadImage';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const useImageUpload = () => {
    const [sendImage] = useSendImageMutation();
    const [preview, setPreview] = useState<string | null>(null);

    const uploadFileHandler = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue?: (field: string, value: any) => void,
    ) => {
        if (!e.target.files || e.target.files.length === 0) {
            toast.error('No file selected');
            return null;
        }
        try {
            const imageFile = e.target.files[0];
            const res = await sendImage({ imageFile }).unwrap();
            if (setFieldValue) {
                setPreview(res.image);
                setFieldValue('preview', res.image);
            }
            return res.image;
        } catch (err: any) {
            if (err.status === 413) {
                toast.error('File is too large. Maximum size is 1MB');
            } else if (err.data?.message) {
                toast.error(err.data.message);
            } else {
                toast.error('Error uploading image');
            }
            console.error('Upload error:', err);
            return null;
        }
    };
    return {
        uploadFileHandler,
        preview,
        setPreview,
    };
};

export default useImageUpload;
