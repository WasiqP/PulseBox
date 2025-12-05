import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import Button from './Button';
import './AlertModal.css';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="alert-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="alert-modal"
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 2001
            }}
          >
            <div className="alert-modal-header">
              <div className="alert-modal-icon">
                <FiAlertCircle />
              </div>
              <button className="alert-modal-close" onClick={onClose}>
                <FiX />
              </button>
            </div>
            <div className="alert-modal-content">
              <h3 className="alert-modal-title">{title}</h3>
              <p className="alert-modal-message">{message}</p>
            </div>
            <div className="alert-modal-actions">
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                style={{
                  background: '#FFB84D',
                  borderColor: '#FFB84D',
                  color: '#000000'
                }}
              >
                {buttonText}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;

