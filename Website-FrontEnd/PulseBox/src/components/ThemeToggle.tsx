import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        className="theme-toggle-track"
        animate={{
          backgroundColor: theme === 'dark' ? '#A060FF' : '#E0CBFF',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="theme-toggle-thumb"
          animate={{
            x: theme === 'dark' ? 24 : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {theme === 'dark' ? (
            <FiMoon className="theme-icon" />
          ) : (
            <FiSun className="theme-icon" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};

export default ThemeToggle;

