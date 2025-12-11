import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTasks } from '../context/TasksContext';
import { useClasses } from '../context/ClassesContext';
import {
  FiCheck,
  FiCopy,
  FiShare2,
  FiMail,
  FiMessageCircle,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiArrowLeft,
  FiFileText,
  FiClock,
  FiUsers,
  FiAward,
  FiLock,
  FiEyeOff,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiEye,
} from 'react-icons/fi';
import './DashboardPage.css';

const PublishingScreen: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById, publishTask } = useTasks();
  const { classes } = useClasses();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);
  const [showStudentsList, setShowStudentsList] = useState(false);

  const task = taskId ? getTaskById(taskId) : null;
  const classData = task ? classes.find(c => c.id === task.classId) : null;

  const shareLink = task?.shareLink || (taskId ? `${window.location.origin}/task/${taskId}` : '');
  const isPublished = task?.published || false;

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return '#A060FF';
      case 'test': return '#FF6B6B';
      case 'assignment': return '#4ECDC4';
      case 'homework': return '#FFD93D';
      default: return '#A060FF';
    }
  };

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

  const handlePublish = () => {
    if (!taskId) return;
    setIsPublishing(true);
    publishTask(taskId);
    setTimeout(() => {
      setIsPublishing(false);
      // Stay on the publishing screen after publishing
      // User can navigate away using Back button or sidebar
    }, 1000);
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

    // Simulate email sending (in production, this would call an API)
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

  const handleShare = (platform: string) => {
    const text = `Check out this ${task?.taskType}: ${task?.name}`;
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

  useEffect(() => {
    if (!task) {
      navigate('/app/tasks');
    }
  }, [task, navigate]);

  if (!task) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <p>Task not found</p>
            <Button onClick={() => navigate('/app/tasks')}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="back-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: 0,
              }}
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="dashboard-title">Publish & Share Task</h1>
            <p className="dashboard-subtitle">Preview your task and share it with your students</p>
          </motion.div>
        </div>

        <div className="publishing-container">
          {/* Publish Button */}
          {!isPublished && (
            <Card className="publish-card" glass={true}>
              <div className="publish-actions">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<FiShare2 />}
                  onClick={handlePublish}
                  isLoading={isPublishing}
                  style={{ width: '100%' }}
                >
                  {isPublishing ? 'Publishing...' : 'Publish Task'}
                </Button>
                <p className="publish-hint">
                  Once published, your task will be accessible via shareable link, QR code, and can be assigned to students
                </p>
              </div>
            </Card>
          )}

          {isPublished && (
            <Card className="published-card" glass={true}>
              <div className="published-success">
                <FiCheck />
                <div>
                  <h3>Task Published Successfully!</h3>
                  <p>Your task is now live and accessible. Use the sections below to share with students or everyone.</p>
                </div>
              </div>
              <div className="published-actions">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<FiEye />}
                  onClick={() => window.open(`/task/${taskId}`, '_blank')}
                  style={{ width: '100%' }}
                >
                  Preview Task
                </Button>
              </div>
            </Card>
          )}

          {/* Task Preview */}
          <Card className="task-preview-card" glass={true}>
            <div className="task-preview-header">
              <div className="task-preview-type" style={{ background: `${getTaskTypeColor(task.taskType)}20`, color: getTaskTypeColor(task.taskType) }}>
                <FiFileText />
                <span>{getTaskTypeLabel(task.taskType)}</span>
              </div>
              {isPublished && (
                <div className="task-published-badge">
                  <FiCheck />
                  <span>Published</span>
                </div>
              )}
            </div>

            <h2 className="task-preview-title">{task.name}</h2>

            <div className="task-preview-info">
              <div className="task-info-item">
                <FiUsers />
                <div>
                  <span className="info-label">Class</span>
                  <span className="info-value">{classData?.name || 'Unknown Class'}</span>
                </div>
              </div>
              <div className="task-info-item">
                <FiClock />
                <div>
                  <span className="info-label">Due Date</span>
                  <span className="info-value">{formatDate(task.dueDate)}</span>
                </div>
              </div>
              <div className="task-info-item">
                <FiClock />
                <div>
                  <span className="info-label">Expected Time</span>
                  <span className="info-value">{formatTime(task.expectedTime, task.timeUnit)}</span>
                </div>
              </div>
              {task.markingCriteria && (
                <div className="task-info-item">
                  <FiAward />
                  <div>
                    <span className="info-label">Total Marks</span>
                    <span className="info-value">{task.markingCriteria.totalMarks} marks</span>
                  </div>
                </div>
              )}
            </div>

            {/* Permissions Summary */}
            {Object.values(task.permissions).some(v => v) && (
              <div className="task-permissions-summary">
                <h3>Security Settings</h3>
                <div className="permissions-list">
                  {task.permissions.lockScreen && (
                    <div className="permission-badge">
                      <FiLock />
                      <span>Screen Lock</span>
                    </div>
                  )}
                  {task.permissions.preventTabSwitch && (
                    <div className="permission-badge">
                      <FiEyeOff />
                      <span>Tab Switch Prevention</span>
                    </div>
                  )}
                  {task.permissions.preventCopyPaste && (
                    <div className="permission-badge">
                      <FiLock />
                      <span>Copy/Paste Disabled</span>
                    </div>
                  )}
                  {task.permissions.showTimer && (
                    <div className="permission-badge">
                      <FiClock />
                      <span>Timer Enabled</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions Preview */}
            <div className="task-questions-preview">
              <h3>Questions Preview ({task.questions.length})</h3>
              <div className="questions-preview-list">
                {task.questions.slice(0, 5).map((question, index) => (
                  <div key={question.id} className="question-preview-item">
                    <span className="question-number">{index + 1}</span>
                    <div className="question-preview-content">
                      <p className="question-preview-title">{question.title || 'Untitled Question'}</p>
                      <span className="question-preview-type">{question.type}</span>
                    </div>
                  </div>
                ))}
                {task.questions.length > 5 && (
                  <div className="question-preview-more">
                    +{task.questions.length - 5} more questions
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Share with Students Section */}
          {isPublished && classData && classData.students && classData.students.length > 0 && (
            <Card className="sharing-card share-with-students-card" glass={true}>
              <div className="sharing-section-header">
                <div>
                  <h2 className="sharing-title">Share with Students</h2>
                  <p className="sharing-description">
                    Assign this task directly to all students in {classData.name} via email
                  </p>
                </div>
                <div className="students-count-badge">
                  <FiUsers />
                  <span>{classData.students.length} Students</span>
                </div>
              </div>

              {/* Direct Email Assignment */}
              <div className="email-assignment-section">
                <div className="email-assignment-header">
                  <div>
                    <label>Assign to Students via Email</label>
                    <p className="email-assignment-description">
                      Send this task directly to all {classData.students.length} students in {classData.name}
                    </p>
                  </div>
                  <button
                    className="toggle-students-list-btn"
                    onClick={() => setShowStudentsList(!showStudentsList)}
                    title={showStudentsList ? 'Hide students' : 'Show students'}
                  >
                    {showStudentsList ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {showStudentsList && (
                  <div className="students-email-list">
                    <div className="students-list-header">
                      <span>Students ({classData.students.length})</span>
                    </div>
                    <div className="students-email-items">
                      {classData.students.map((student) => (
                        <div key={student.id} className="student-email-item">
                          <div className="student-email-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="student-email-info">
                            <span className="student-email-name">{student.name}</span>
                            <span className="student-email-address">{student.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<FiSend />}
                  onClick={handleAssignToStudents}
                  isLoading={isSendingEmails}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {isSendingEmails
                    ? 'Sending Emails...'
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

                <p className="email-assignment-hint">
                  Clicking this button will open your default email client with all student emails pre-filled. 
                  The task link and details will be included in the email body.
                </p>
              </div>
            </Card>
          )}

          {/* Share with Everyone Section - Only show if task is public */}
          {(task.visibility === 'public' || !task.visibility) && (
            <Card className="sharing-card share-with-everyone-card" glass={true}>
              <div className="sharing-section-header">
                <div>
                  <h2 className="sharing-title">Share with Everyone</h2>
                  <p className="sharing-description">
                    {isPublished
                      ? 'Share this task publicly via link, QR code, or social media platforms'
                      : 'Publish your task to generate a shareable link and QR code.'}
                  </p>
                </div>
              </div>

              {isPublished ? (
              <>
                {/* Share Link */}
                <div className="share-link-section">
                  <label>Shareable Link</label>
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
                  <label>QR Code</label>
                  <div className="qr-code-container">
                    <QRCodeSVG
                      value={shareLink}
                      size={200}
                      level="H"
                      includeMargin={true}
                      fgColor="#A060FF"
                      bgColor="transparent"
                    />
                    <p className="qr-code-hint">Anyone can scan this code to access the task</p>
                  </div>
                </div>

                {/* Social Media Sharing */}
                <div className="social-sharing-section">
                  <label>Share on Social Media</label>
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
              </>
            ) : (
              <div className="publish-prompt">
                <p>Publish your task to enable public sharing options</p>
              </div>
            )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublishingScreen;

