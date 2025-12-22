import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message,
  fullScreen = false 
}) => {
  const sizeClass = `spinner-${size}`;
  
  const spinner = (
    <div className={`loading-spinner ${fullScreen ? 'full-screen' : ''}`}>
      <motion.div
        className={`spinner ${sizeClass}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  return spinner;
};

export default LoadingSpinner;

