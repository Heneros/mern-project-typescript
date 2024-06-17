import { useRegisterUserMutation } from 'features/auth/authApiSlice';
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from 'shared/ui/FormContainer';
import {
    strengthColor,
    strengthIndicator,
} from 'shared/utils/password-strength';

interface PasswordStrength {
    label: string;
    color: string;
}

export const Registration = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState<PasswordStrength>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowHidePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleShowHideConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (e: React.MouseEvent<InputEvent>) => {
        e.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    const [registerUser, { data, isLoading }] = useRegisterUserMutation();

    return (
        <FormContainer>
            <h1>Register</h1>
        </FormContainer>
    );
};
