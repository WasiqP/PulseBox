import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ShareTaskModal from '../components/ui/ShareTaskModal';
import { useHomework } from '../context/HomeworkContext';
import { useClasses } from '../context/ClassesContext';
import { useTasks } from '../context/TasksContext';
import { useConfirm } from '../context/ConfirmModalContext';
import { FiFileText, FiSearch, FiPlus, FiClock, FiUsers, FiCheckCircle, FiBook, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import './DashboardPage.css';

type TaskType = 'quiz' | 'assignment' | 'test' | 'homework';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  class: string;
  classId: string;
  questions?: number;
  submissions: number;
  totalStudents: number;
  dueDate: string;
  status: 'active' | 'completed';
  isHomework?: boolean; // Flag to identify homework tasks
  published?: boolean; // Flag to identify published tasks
  createdAt?: string; // Creation date for sorting
  publishedAt?: string; // Publication date for sorting
  isDraft?: boolean; // Flag to identify draft tasks
  shareLink?: string; // Share link for published tasks
}

const MyTasksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quiz' | 'assignment' | 'test' | 'homework' | 'drafts'>('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { homeworks, deleteHomework } = useHomework();
  const { classes } = useClasses();
  const { tasks, deleteTask } = useTasks();
  const { confirm } = useConfirm();

  // Convert homeworks to tasks format
  const homeworkTasks: Task[] = useMemo(() => {
    return homeworks.map(hw => {
      const classData = classes.find(c => c.id === hw.classId);
      return {
        id: hw.id,
        title: hw.title,
        type: 'homework' as TaskType,
        class: classData?.name || 'Unknown Class',
        classId: hw.classId,
        submissions: hw.submissions.length,
        totalStudents: hw.totalStudents,
        dueDate: hw.dueDate,
        status: new Date(hw.dueDate) < new Date() ? 'completed' : 'active',
        createdAt: hw.createdAt
      };
    });
  }, [homeworks, classes]);

  // Convert tasks from TasksContext to Task format (show all tasks)
  const publishedTasks: Task[] = useMemo(() => {
    return tasks
      .map(t => {
        const classData = classes.find(c => c.id === t.classId);
        const isDraft = !t.published || t.questions.length === 0;
        return {
          id: t.id,
          title: t.name,
          type: t.taskType as TaskType,
          class: classData?.name || 'Unknown Class',
          classId: t.classId,
          questions: t.questions.length,
          submissions: 0, // TODO: Get actual submissions count from context
          totalStudents: classData?.studentCount || 0,
          dueDate: t.dueDate,
          status: new Date(t.dueDate) < new Date() ? 'completed' : 'active',
          published: t.published || false,
          createdAt: t.createdAt,
          publishedAt: t.publishedAt,
          isDraft: isDraft,
          shareLink: t.shareLink || (t.published ? `${window.location.origin}/task/${t.id}` : undefined)
        };
      });
  }, [tasks, classes]);

  // Combine all tasks (published tasks + homeworks)
  const allTasks = [...publishedTasks, ...homeworkTasks];

  const filteredTasks = useMemo(() => {
    const filtered = allTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.class.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = false;
      if (filter === 'all') {
        // Exclude draft tasks from "All" filter
        matchesFilter = task.isDraft !== true;
      } else if (filter === 'drafts') {
        // Show only draft tasks (unpublished or incomplete)
        matchesFilter = task.isDraft === true;
      } else {
        // Filter by task type (also exclude drafts)
        matchesFilter = task.type === filter && task.isDraft !== true;
      }
      
      return matchesSearch && matchesFilter;
    });

    // Sort by most recent first (publishedAt if published, otherwise createdAt)
    return filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const dateB = b.publishedAt ? new Date(b.publishedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }, [allTasks, searchQuery, filter]);

  const getTypeColor = (type: TaskType) => {
    switch (type) {
      case 'quiz': return '#A060FF';
      case 'assignment': return '#4ECDC4';
      case 'test': return '#FF6B6B';
      case 'homework': return '#FFD93D';
      default: return '#A060FF';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'quiz': return <FiFileText />;
      case 'assignment': return <FiFileText />;
      case 'test': return <FiFileText />;
      case 'homework': return <FiBook />;
      default: return <FiFileText />;
    }
  };

  const getSubmissionRate = (submissions: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((submissions / total) * 100);
  };

  const handleDelete = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    
    confirm({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        if (task.isHomework) {
          deleteHomework(task.id);
        } else {
          deleteTask(task.id);
        }
      },
    });
  };

  const handleShare = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!task.published) {
      alert('Please publish the task first before sharing.');
      return;
    }

    setSelectedTaskId(task.id);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSelectedTaskId(null);
  };

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
            <h1 className="dashboard-title">My Tasks</h1>
            <p className="dashboard-subtitle">Manage all your quizzes, assignments, tests, and homework</p>
          </motion.div>

          <Link to="/app/tasks/create">
            <Button variant="primary" size="md" leftIcon={<FiPlus />}>
              Create Task
            </Button>
          </Link>
        </div>

        <motion.div
          className="quizzes-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="search-bar">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'quiz' ? 'active' : ''}`}
              onClick={() => setFilter('quiz')}
            >
              Quizzes
            </button>
            <button
              className={`filter-btn ${filter === 'assignment' ? 'active' : ''}`}
              onClick={() => setFilter('assignment')}
            >
              Assignments
            </button>
            <button
              className={`filter-btn ${filter === 'test' ? 'active' : ''}`}
              onClick={() => setFilter('test')}
            >
              Tests
            </button>
            <button
              className={`filter-btn ${filter === 'homework' ? 'active' : ''}`}
              onClick={() => setFilter('homework')}
            >
              Homework
            </button>
            <button
              className={`filter-btn ${filter === 'drafts' ? 'active' : ''}`}
              onClick={() => setFilter('drafts')}
            >
              Drafts
            </button>
          </div>
        </motion.div>

        <motion.div
          className="quizzes-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredTasks.length === 0 ? (
            <Card className="empty-state-card" glass={true}>
              <div className="empty-state">
                <FiFileText className="empty-icon" />
                <h3>No tasks found</h3>
                <p>
                  {filter === 'drafts' 
                    ? 'You have no draft tasks. Drafts are tasks that are unpublished or incomplete.' 
                    : 'Create your first task to get started'}
                </p>
                <Link to="/app/tasks/create">
                  <Button variant="primary" size="md" leftIcon={<FiPlus />}>
                    Create Task
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Link key={task.id} to={task.isHomework ? `/app/homework` : `/app/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                <Card className="quiz-card" glass={true} hoverEffect={true}>
                  <div className="quiz-header">
                    <div className="quiz-type-badge" style={{ backgroundColor: `${getTypeColor(task.type)}20`, color: getTypeColor(task.type) }}>
                      <span className="task-type-icon">{getTypeIcon(task.type)}</span>
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {task.isDraft && !task.isHomework && (
                        <span className="quiz-status" style={{ 
                          background: 'rgba(255, 211, 61, 0.15)', 
                          color: '#FFD93D',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          Draft
                        </span>
                      )}
                      {!task.isDraft && (
                        <span className={`quiz-status status-${task.status}`}>
                          {task.status}
                        </span>
                      )}
                      {task.published && !task.isHomework && (
                        <button
                          className="task-preview-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(`/task/${task.id}`, '_blank');
                          }}
                          title="Preview Task"
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(160, 96, 255, 0.3)',
                            color: 'var(--color-primary, #a060ff)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--transition-fast)',
                            fontSize: '1.1rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(160, 96, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--color-primary, #a060ff)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(160, 96, 255, 0.3)';
                          }}
                        >
                          <FiEye />
                        </button>
                      )}
                      <button
                        className="task-delete-btn"
                        onClick={(e) => handleDelete(e, task)}
                        title="Delete task"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FF6B6B',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all var(--transition-fast)',
                          fontSize: '1.1rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <h3 className="quiz-title">{task.title}</h3>
                  <p className="quiz-class">{task.class}</p>
                  <div className="quiz-stats">
                    {task.questions && (
                      <div className="quiz-stat-item">
                        <FiFileText />
                        <span>{task.questions} Questions</span>
                      </div>
                    )}
                    <div className="quiz-stat-item">
                      <FiUsers />
                      <span>{task.submissions}/{task.totalStudents} Submissions</span>
                    </div>
                    <div className="quiz-stat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiClock />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      {task.published && !task.isHomework && (
                        <button
                          className="task-share-btn"
                          onClick={(e) => handleShare(e, task)}
                          title="Share Task"
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(160, 96, 255, 0.3)',
                            color: 'var(--color-primary, #a060ff)',
                            cursor: 'pointer',
                            padding: '0.4rem 0.6rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all var(--transition-fast)',
                            fontSize: '0.9rem',
                            gap: '0.25rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(160, 96, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--color-primary, #a060ff)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(160, 96, 255, 0.3)';
                          }}
                        >
                          <FiShare2 />
                          <span style={{ fontSize: '0.75rem' }}>Share</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="quiz-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${getSubmissionRate(task.submissions, task.totalStudents)}%`,
                          backgroundColor: getTypeColor(task.type)
                        }}
                      />
                    </div>
                    <span className="progress-text">{getSubmissionRate(task.submissions, task.totalStudents)}% Complete</span>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </motion.div>

        {/* Share Task Modal */}
        {selectedTaskId && (
          <ShareTaskModal
            isOpen={shareModalOpen}
            onClose={handleCloseShareModal}
            taskId={selectedTaskId}
          />
        )}
      </main>
    </div>
  );
};

export default MyTasksPage;


