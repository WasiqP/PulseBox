import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiLock, FiEyeOff, FiClock, FiX } from 'react-icons/fi';
import Button from './Button';
import './TaskWarningModal.css';

interface TaskWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  permissions: {
    lockScreen: boolean;
    preventTabSwitch: boolean;
    preventCopyPaste: boolean;
    showTimer: boolean;
  };
  expectedTime?: number;
  timeUnit?: 'minutes' | 'hours';
}

const TaskWarningModal: React.FC<TaskWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  permissions,
  expectedTime,
  timeUnit,
}) => {
  const enabledConditions = [
    permissions.lockScreen && {
      icon: <FiLock />,
      title: 'Screen Lock Enabled',
      description: 'You cannot leave this page once you start. If you attempt to navigate away, your task will be automatically submitted.',
      color: '#FF6B6B',
    },
    permissions.preventTabSwitch && {
      icon: <FiEyeOff />,
      title: 'Tab Switch Prevention',
      description: 'Switching to other browser tabs or windows is not allowed. After 3 attempts, your task will be automatically submitted.',
      color: '#FF6B6B',
    },
    permissions.preventCopyPaste && {
      icon: <FiLock />,
      title: 'Copy/Paste Disabled',
      description: 'Copy and paste functionality is disabled. You must type all answers manually in the input fields.',
      color: '#FFB84D',
    },
    permissions.showTimer && {
      icon: <FiClock />,
      title: 'Timer Enabled',
      description: expectedTime && timeUnit
        ? `This task has a time limit of ${expectedTime} ${timeUnit}. Once the timer reaches zero, your task will be automatically submitted, even if incomplete.`
        : 'This task has a time limit. Once the timer reaches zero, your task will be automatically submitted, even if incomplete.',
      color: '#4ECDC4',
    },
  ].filter(Boolean);

  if (enabledConditions.length === 0) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="task-warning-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="task-warning-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="task-warning-header">
              <div className="task-warning-icon">
                <FiAlertTriangle />
              </div>
              <button className="task-warning-close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="task-warning-content">
              <h2 className="task-warning-title">Important: Task Security Conditions</h2>
              <p className="task-warning-intro">
                Before you begin, please review the following security conditions that apply to this task:
              </p>

              <div className="task-warning-conditions">
                {enabledConditions.map((condition, index) => (
                  <motion.div
                    key={index}
                    className="task-warning-condition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="task-warning-condition-icon"
                      style={{ color: condition.color, background: `${condition.color}20` }}
                    >
                      {condition.icon}
                    </div>
                    <div className="task-warning-condition-content">
                      <h3 className="task-warning-condition-title">{condition.title}</h3>
                      <p className="task-warning-condition-description">{condition.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="task-warning-footer">
                <p className="task-warning-note">
                  ⚠️ By clicking "I Understand, Start Task", you acknowledge that you have read and understood these conditions.
                </p>
              </div>
            </div>

            <div className="task-warning-actions">
              <Button
                variant="secondary"
                onClick={onClose}
                style={{ marginRight: '1rem' }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                leftIcon={<FiLock />}
              >
                I Understand, Start Task
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskWarningModal;

