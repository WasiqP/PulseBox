import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import Button from './Button';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="confirm-modal"
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
            <div className="confirm-modal-header">
              <div className={`confirm-modal-icon ${type}`}>
                <FiAlertTriangle />
              </div>
              <button className="confirm-modal-close" onClick={onClose}>
                <FiX />
              </button>
            </div>
            <div className="confirm-modal-content">
              <h3 className="confirm-modal-title">{title}</h3>
              <p className="confirm-modal-message">{message}</p>
            </div>
            <div className="confirm-modal-actions">
              <Button
                variant="outline"
                size="md"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button
                variant={type === 'danger' ? 'primary' : 'primary'}
                size="md"
                onClick={handleConfirm}
                style={type === 'danger' ? {
                  background: '#FF6B6B',
                  borderColor: '#FF6B6B'
                } : {}}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

