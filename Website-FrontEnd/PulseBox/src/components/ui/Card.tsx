import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    glass?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverEffect = false,
    glass = true,
    onClick
}) => {
    return (
        <motion.div
            className={`card ${glass ? 'card-glass' : 'card-solid'} ${className}`}
            whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default Card;
