import React, { useState, useEffect } from 'react';

interface CounterProps {
    target: number;
    speed: number;
}

const Counter: React.FC<CounterProps> = ({ target, speed }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = speed;
        const start = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            setCount(Math.round(progress * target));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [target, speed]);

    return <h2 className="timer count-title count-number">{count}</h2>;
};

export default Counter;
