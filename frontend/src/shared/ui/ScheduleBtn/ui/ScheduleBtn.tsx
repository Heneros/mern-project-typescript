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
                {/* Fix later */}
                {isInCart ? (
                    <>
                        {' '}
                        <i>
                            <FontAwesomeIcon icon={faCalendar} />
                        </i>
                        Schedule a visit
                    </>
                ) : (
                    'Schedule a visit'
                )}
            </span>
        </>
    );
};
