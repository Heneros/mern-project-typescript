import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { BASE_URL } from 'shared/consts/urls';

const GithubAuth = () => {
    const github = () => {
        window.open(`${BASE_URL}/api/v1/auth/github`, '_self');
    };

    return (
        <span style={{ cursor: 'pointer' }} onClick={github}>
            <FaGithub size={30} className="github-icon" />
        </span>
    );
};

export default GithubAuth;
