import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <motion.button
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <span className="btn-spinner"></span>}
            {!isLoading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
            <span className="btn-text">{children}</span>
            {!isLoading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </motion.button>
    );
};

export default Button;
