import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { useClasses } from '../context/ClassesContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  FiFileText,
  FiClock,
  FiUsers,
  FiAward,
  FiLock,
  FiEyeOff,
  FiCheck,
  FiArrowRight,
  FiUser,
  FiMail,
} from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import './PreviewTask.css';

const PreviewTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById } = useTasks();
  const { classes } = useClasses();
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
  });
  const [showIdentificationForm, setShowIdentificationForm] = useState(false);

  const task = taskId ? getTaskById(taskId) : null;
  const classData = task ? classes.find(c => c.id === task.classId) : null;

  useEffect(() => {
    if (task) {
      // Show identification form only if required AND we don't have the info yet
      setShowIdentificationForm(task.requireIdentification && (!studentInfo.name || !studentInfo.email));
    }
  }, [task, studentInfo]);

  if (!task) {
    return (
      <div className="preview-task-container">
        <div className="preview-task-error">
          <h1>Task Not Found</h1>
          <p>The task you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (!task.published) {
    return (
      <div className="preview-task-container">
        <div className="preview-task-error">
          <h1>Task Not Available</h1>
          <p>This task has not been published yet.</p>
        </div>
      </div>
    );
  }

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

  const handleStartTask = () => {
    if (task.requireIdentification && (!studentInfo.name || !studentInfo.email)) {
      alert('Please provide your name and email to continue.');
      return;
    }
    // Navigate to MainTask screen with student info if required
    navigate(`/task/${taskId}/take`, {
      state: {
        studentInfo: task.requireIdentification ? studentInfo : null
      }
    });
  };

  const handleIdentificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentInfo.name && studentInfo.email) {
      setShowIdentificationForm(false);
    }
  };

  return (
    <div className="preview-task-container">
      <div className="preview-task-content">
        {/* Header */}
        <motion.div
          className="preview-task-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="preview-task-brand">
            <span className="preview-brand-text">
              <span className="brand-r">R</span>aviro<span className="brand-dot">.</span>
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="preview-task-main">
          <motion.div
            className="preview-task-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Task Type and Status */}
            <div className="preview-task-badges">
              <div
                className="preview-task-type-badge"
                style={{
                  background: `${getTaskTypeColor(task.taskType)}20`,
                  color: getTaskTypeColor(task.taskType),
                }}
              >
                <FiFileText />
                <span>{getTaskTypeLabel(task.taskType)}</span>
              </div>
              <div className="preview-task-published-badge">
                <FiCheck />
                <span>Published</span>
              </div>
            </div>

            {/* Task Title */}
            <h1 className="preview-task-title">{task.name}</h1>

            {/* Task Information */}
            <Card className="preview-task-info-card" glass={true}>
              <div className="preview-task-info-grid">
                {classData && (
                  <div className="preview-info-item">
                    <FiUsers />
                    <div>
                      <span className="preview-info-label">CLASS</span>
                      <span className="preview-info-value">{classData.name}</span>
                    </div>
                  </div>
                )}
                <div className="preview-info-item">
                  <FiClock />
                  <div>
                    <span className="preview-info-label">DUE DATE</span>
                    <span className="preview-info-value">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
                <div className="preview-info-item">
                  <FiClock />
                  <div>
                    <span className="preview-info-label">EXPECTED TIME</span>
                    <span className="preview-info-value">{formatTime(task.expectedTime, task.timeUnit)}</span>
                  </div>
                </div>
                {task.markingCriteria && (
                  <div className="preview-info-item">
                    <FiAward />
                    <div>
                      <span className="preview-info-label">TOTAL MARKS</span>
                      <span className="preview-info-value">{task.markingCriteria.totalMarks} marks</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Security Settings */}
            {Object.values(task.permissions).some(v => v) && (
              <Card className="preview-task-security-card" glass={true}>
                <h3 className="preview-section-title">Security Settings</h3>
                <div className="preview-permissions-list">
                  {task.permissions.lockScreen && (
                    <div className="preview-permission-badge">
                      <FiLock />
                      <span>Screen Lock</span>
                    </div>
                  )}
                  {task.permissions.preventTabSwitch && (
                    <div className="preview-permission-badge">
                      <FiEyeOff />
                      <span>Tab Switch Prevention</span>
                    </div>
                  )}
                  {task.permissions.preventCopyPaste && (
                    <div className="preview-permission-badge">
                      <FiLock />
                      <span>Copy/Paste Disabled</span>
                    </div>
                  )}
                  {task.permissions.showTimer && (
                    <div className="preview-permission-badge">
                      <FiClock />
                      <span>Timer Enabled</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </motion.div>

          {/* Right Panel - Identification & Start */}
          <motion.div
            className="preview-task-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {task.requireIdentification && showIdentificationForm ? (
              <Card className="preview-identification-card" glass={true}>
                <div className="preview-identification-header">
                  <FiUser />
                  <h2>Identification Required</h2>
                  <p>Please provide your information to access this task</p>
                </div>
                <form onSubmit={handleIdentificationSubmit} className="preview-identification-form">
                  <div className="preview-form-group">
                    <label htmlFor="studentName">
                      <FiUser />
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="preview-form-group">
                    <label htmlFor="studentEmail">
                      <FiMail />
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="studentEmail"
                      value={studentInfo.email}
                      onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    style={{ marginTop: '1rem' }}
                  >
                    Continue
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="preview-start-card" glass={true}>
                <div className="preview-start-toggle">
                  <ThemeToggle />
                </div>
                <div className="preview-start-content">
                  <div className="preview-start-icon">
                    <FiFileText />
                  </div>
                  <h2>Ready to Start?</h2>
                  <p>
                    {task.requireIdentification
                      ? `You're all set, ${studentInfo.name}! Click below to begin the task.`
                      : 'Click the button below to start answering the questions.'}
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<FiArrowRight />}
                    onClick={handleStartTask}
                    style={{ marginTop: '1.5rem' }}
                  >
                    Start Task
                  </Button>
                  {task.permissions.showTimer && (
                    <p className="preview-timer-hint">
                      ⏱️ This task has a timer. Make sure you're ready before starting.
                    </p>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTask;
