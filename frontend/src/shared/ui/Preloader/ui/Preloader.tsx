import React, { useEffect, useState } from 'react';

export function Preloader() {
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setVisible(false);
        }, 800);
        return () => clearTimeout(timeoutId);
    });

    return (
        <div
            id="js-preloader"
            className={`js-preloader ${visible ? '' : 'loaded'}`}
            aria-hidden={!visible}
        >
            <div className="preloader-inner">
                <span className="dot"></span>
                <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}
