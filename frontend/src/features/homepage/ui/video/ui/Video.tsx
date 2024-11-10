import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import VideoBg from 'shared/assets/images/video-bg.jpg';
import VideoFrame from 'shared/assets/images/video-frame.jpg';

export const Video = () => {
    return (
        // background-image: url(../images/video-bg.jpg);
        <>
            <div
                className="video section"
                style={{ backgroundImage: `url(${VideoBg})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">
                            <div className="section-heading text-center">
                                <h6>| Video View</h6>
                                <h2>Get Closer View & Different Feeling</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="video-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <div className="video-frame">
                                <img src={VideoFrame} alt="video frame" />
                                <Link to="https://youtube.com" target="_blank">
                                    <FontAwesomeIcon icon={faPlay} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
