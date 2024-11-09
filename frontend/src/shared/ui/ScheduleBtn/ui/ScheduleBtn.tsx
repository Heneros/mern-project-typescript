import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ScheduleBtn.css';

interface ScheduleBtnProps {
    onClick: () => void;
    isInCart?: boolean;
}

export const ScheduleBtn: React.FC<ScheduleBtnProps> = ({
    onClick,
    isInCart,
}) => {
    return (
        <>
            <span className="lastBtnHeader" onClick={onClick}>
                <i>
                    <FontAwesomeIcon icon={faCalendar} />
                </i>
                {isInCart ? 'Schedule a visit' : 'Add to cart'}
            </span>
        </>
    );
};
