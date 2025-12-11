import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  FiX,
  FiCopy,
  FiCheck,
  FiShare2,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiMail,
  FiMessageCircle,
  FiUsers,
  FiSend,
} from 'react-icons/fi';
import { useTasks } from '../../context/TasksContext';
import { useClasses } from '../../context/ClassesContext';
import Button from './Button';
import './ShareTaskModal.css';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ isOpen, onClose, taskId }) => {
  const { getTaskById } = useTasks();
  const { classes } = useClasses();
  const [copied, setCopied] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);

  const task = getTaskById(taskId);
  const classData = task ? classes.find(c => c.id === task.classId) : null;
  const shareLink = task?.shareLink || (taskId ? `${window.location.origin}/task/${taskId}` : '');
  const isPublished = task?.published || false;

  const getTaskTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: number, unit: string) => {
    return `${time} ${unit}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    if (!task) return;
    
    const text = `Check out this ${task.taskType}: ${task.name}`;
    const url = shareLink;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this task: ${url}`)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleAssignToStudents = async () => {
    if (!classData || !classData.students || classData.students.length === 0) {
      alert('No students found in this class. Please add students first.');
      return;
    }

    if (!isPublished) {
      alert('Please publish the task first before assigning it to students.');
      return;
    }

    setIsSendingEmails(true);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create mailto link with all student emails
    const studentEmails = classData.students.map(s => s.email).join(',');
    const subject = encodeURIComponent(`New ${getTaskTypeLabel(task?.taskType || 'task')}: ${task?.name}`);
    const body = encodeURIComponent(
      `Hello Students,\n\n` +
      `A new ${getTaskTypeLabel(task?.taskType || 'task')} has been assigned to you.\n\n` +
      `Task: ${task?.name}\n` +
      `Due Date: ${formatDate(task?.dueDate || '')}\n` +
      `Expected Time: ${formatTime(task?.expectedTime || 0, task?.timeUnit || 'minutes')}\n\n` +
      `Access the task here: ${shareLink}\n\n` +
      `Good luck!`
    );

    // Open email client with pre-filled information
    window.location.href = `mailto:${studentEmails}?subject=${subject}&body=${body}`;

    setIsSendingEmails(false);
    setEmailsSent(true);
    setTimeout(() => setEmailsSent(false), 5000);
  };

  if (!task) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="share-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="share-modal-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="share-modal-card">
              <div className="share-modal-header">
                <div>
                  <h2 className="share-modal-title">Share Task</h2>
                  <p className="share-modal-subtitle">{task.name}</p>
                </div>
                <button className="share-modal-close" onClick={onClose}>
                  <FiX />
                </button>
              </div>

              {!isPublished ? (
                <div className="share-modal-unpublished">
                  <p>Please publish the task first before sharing it.</p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onClose}
                    style={{ marginTop: '1rem' }}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <div className="share-modal-content">
                  {/* Share Link */}
                  <div className="share-link-section">
                    <label className="share-section-label">Shareable Link</label>
                    <div className="share-link-input-group">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="share-link-input"
                      />
                      <Button
                        variant={copied ? 'primary' : 'outline'}
                        size="md"
                        leftIcon={copied ? <FiCheck /> : <FiCopy />}
                        onClick={handleCopyLink}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="qr-code-section">
                    <label className="share-section-label">QR Code</label>
                    <div className="qr-code-container">
                      <div style={{ 
                        background: 'var(--color-background)', 
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <QRCodeSVG
                          value={shareLink}
                          size={180}
                          level="H"
                          includeMargin={true}
                          fgColor="#A060FF"
                          bgColor="var(--color-background)"
                        />
                      </div>
                      <p className="qr-code-hint">Scan this code to access the task</p>
                    </div>
                  </div>

                  {/* Share with Students */}
                  {classData && classData.students && classData.students.length > 0 && (
                    <div className="share-students-section">
                      <div className="share-students-header">
                        <div>
                          <label className="share-section-label">Share with Students</label>
                          <p className="share-students-description">
                            Send this task directly to all students in {classData.name}
                          </p>
                        </div>
                        <div className="students-count-badge">
                          <FiUsers />
                          <span>{classData.students.length} Students</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<FiSend />}
                        onClick={handleAssignToStudents}
                        isLoading={isSendingEmails}
                        style={{ width: '100%', marginTop: '1rem' }}
                      >
                        {isSendingEmails
                          ? 'Preparing Emails...'
                          : emailsSent
                          ? 'Emails Sent!'
                          : `Send to All ${classData.students.length} Students`}
                      </Button>

                      {emailsSent && (
                        <div className="email-sent-success">
                          <FiCheck />
                          <span>Task assignment emails have been prepared. Your email client will open with all student addresses.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Media Sharing */}
                  <div className="social-sharing-section">
                    <label className="share-section-label">Share on Social Media</label>
                    <div className="social-buttons">
                      <button
                        className="social-button twitter"
                        onClick={() => handleShare('twitter')}
                        title="Share on Twitter"
                      >
                        <FiTwitter />
                        <span>Twitter</span>
                      </button>
                      <button
                        className="social-button facebook"
                        onClick={() => handleShare('facebook')}
                        title="Share on Facebook"
                      >
                        <FiFacebook />
                        <span>Facebook</span>
                      </button>
                      <button
                        className="social-button linkedin"
                        onClick={() => handleShare('linkedin')}
                        title="Share on LinkedIn"
                      >
                        <FiLinkedin />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        className="social-button email"
                        onClick={() => handleShare('email')}
                        title="Share via Email"
                      >
                        <FiMail />
                        <span>Email</span>
                      </button>
                      <button
                        className="social-button whatsapp"
                        onClick={() => handleShare('whatsapp')}
                        title="Share on WhatsApp"
                      >
                        <FiMessageCircle />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareTaskModal;
