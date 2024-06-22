import React from 'react';
import { motion } from 'framer-motion';

interface AuthButtonAnimationProps {
    type?: string;
    children: React.ReactNode;
}
export function AuthButtonAnimation({
    children,
    type = 'default',
}: AuthButtonAnimationProps) {
    switch (type) {
        default:
            return (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {children}
                </motion.div>
            );
    }
}
