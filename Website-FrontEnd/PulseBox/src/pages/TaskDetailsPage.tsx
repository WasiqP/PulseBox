import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ShareTaskModal from '../components/ui/ShareTaskModal';
import { useTasks } from '../context/TasksContext';
import { useClasses } from '../context/ClassesContext';
import { useConfirm } from '../context/ConfirmModalContext';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiClock,
  FiUsers,
  FiAward,
  FiLock,
  FiEyeOff,
  FiCheckCircle,
  FiGlobe,
  FiList,
  FiCheckSquare,
  FiChevronDown,
  FiType,
  FiAlignLeft,
  FiEye,
  FiShare2,
} from 'react-icons/fi';
import './DashboardPage.css';

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById, deleteTask } = useTasks();
  const { classes } = useClasses();
  const { confirm } = useConfirm();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const task = taskId ? getTaskById(taskId) : null;
  const classData = task ? classes.find(c => c.id === task.classId) : null;

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

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'shortText': return <FiType />;
      case 'longText': return <FiAlignLeft />;
      case 'multipleChoice': return <FiList />;
      case 'checkbox': return <FiCheckSquare />;
      case 'dropdown': return <FiChevronDown />;
      default: return <FiFileText />;
    }
  };

  const handleDelete = () => {
    if (!task) return;
    
    confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        deleteTask(task.id);
        navigate('/app/tasks');
      },
    });
  };

  const handleEdit = () => {
    if (!task) return;
    // Navigate to questions screen first, then user can edit from there
    // Or we could create an edit mode in CreateTaskPage
    navigate(`/app/tasks/${task.id}/questions`);
  };

  const handleShare = () => {
    if (!task || !task.published) {
      alert('Please publish the task first before sharing.');
      return;
    }

    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
  };

  if (!task) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <FiFileText className="empty-icon" />
            <h3>Task Not Found</h3>
            <p>The task you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate('/app/tasks')}>
              Back to Tasks
            </Button>
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
            style={{ width: '100%' }}
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
                padding: 0
              }}
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <div className="class-details-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div
                    className="task-preview-type"
                    style={{
                      background: `${getTaskTypeColor(task.taskType)}20`,
                      color: getTaskTypeColor(task.taskType)
                    }}
                  >
                    <FiFileText />
                    <span>{getTaskTypeLabel(task.taskType)}</span>
                  </div>
                  {task.published && (
                    <div className="task-published-badge">
                      <FiCheckCircle />
                      <span>Published</span>
                    </div>
                  )}
                </div>
                <h1 className="dashboard-title">{task.name}</h1>
                <p className="dashboard-subtitle">{classData?.name || 'Unknown Class'}</p>
              </div>
              <div className="class-details-actions">
                {task.published && (
                  <>
                    <Button
                      variant="outline"
                      size="md"
                      leftIcon={<FiEye />}
                      onClick={() => window.open(`/task/${task.id}`, '_blank')}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      leftIcon={<FiShare2 />}
                      onClick={handleShare}
                    >
                      Share
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<FiEdit2 />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<FiTrash2 />}
                  onClick={handleDelete}
                  style={{
                    background: '#FF6B6B',
                    borderColor: '#FF6B6B'
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="class-details-grid">
            {/* Task Information */}
            <Card className="class-info-detail-card" glass={true}>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Task Information</h2>
              <div className="class-info-details">
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    <FiUsers />
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Class</span>
                    <span className="info-detail-value">{classData?.name || 'Unknown Class'}</span>
                  </div>
                </div>
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    <FiClock />
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Due Date</span>
                    <span className="info-detail-value">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    <FiClock />
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Expected Time</span>
                    <span className="info-detail-value">{formatTime(task.expectedTime, task.timeUnit)}</span>
                  </div>
                </div>
                {task.markingCriteria && (
                  <div className="info-detail-item">
                    <div className="info-detail-icon">
                      <FiAward />
                    </div>
                    <div className="info-detail-content">
                      <span className="info-detail-label">Total Marks</span>
                      <span className="info-detail-value">{task.markingCriteria.totalMarks} marks</span>
                    </div>
                  </div>
                )}
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    {task.visibility === 'public' ? <FiGlobe /> : <FiUsers />}
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Visibility</span>
                    <span className="info-detail-value">
                      {task.visibility === 'public' ? 'Public' : 'Only with Created Classes'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Permissions */}
            {Object.values(task.permissions).some(v => v) && (
              <Card className="class-info-detail-card" glass={true}>
                <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Security Settings</h2>
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
              </Card>
            )}
          </div>

          {/* Questions */}
          <Card className="class-info-detail-card" glass={true} style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Questions ({task.questions.length})</h2>
              {!task.published && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/app/tasks/${task.id}/questions`)}
                >
                  Edit Questions
                </Button>
              )}
            </div>
            {task.questions.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <FiFileText className="empty-icon" />
                <p>No questions added yet</p>
                {!task.published && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/app/tasks/${task.id}/questions`)}
                    style={{ marginTop: '1rem' }}
                  >
                    Add Questions
                  </Button>
                )}
              </div>
            ) : (
              <div className="questions-preview-list">
                {task.questions.map((question, index) => (
                  <div key={question.id} className="question-preview-item">
                    <span className="question-number">{index + 1}</span>
                    <div className="question-preview-content">
                      <p className="question-preview-title">{question.title || 'Untitled Question'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="question-preview-type">{question.type}</span>
                        {question.marks && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            • {question.marks} marks
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>
                      {getQuestionTypeIcon(question.type)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Actions */}
          {!task.published && (
            <Card className="class-info-detail-card" glass={true} style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/app/tasks/${task.id}/questions`)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  Continue to Questions
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/app/tasks/${task.id}/publish`)}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  Publish Task
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Share Task Modal */}
        {taskId && (
          <ShareTaskModal
            isOpen={shareModalOpen}
            onClose={handleCloseShareModal}
            taskId={taskId}
          />
        )}
      </main>
    </div>
  );
};

export default TaskDetailsPage;

