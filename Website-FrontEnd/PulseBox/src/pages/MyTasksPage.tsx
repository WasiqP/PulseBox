import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useHomework } from '../context/HomeworkContext';
import { useClasses } from '../context/ClassesContext';
import { useTasks } from '../context/TasksContext';
import { useConfirm } from '../context/ConfirmModalContext';
import { FiFileText, FiSearch, FiPlus, FiClock, FiUsers, FiCheckCircle, FiBook, FiTrash2 } from 'react-icons/fi';
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
}

const MyTasksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quiz' | 'assignment' | 'test' | 'homework'>('all');
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
        status: new Date(hw.dueDate) < new Date() ? 'completed' : 'active'
      };
    });
  }, [homeworks, classes]);

  // Convert tasks from TasksContext to Task format (show all tasks)
  const publishedTasks: Task[] = useMemo(() => {
    return tasks
      .map(t => {
        const classData = classes.find(c => c.id === t.classId);
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
          status: new Date(t.dueDate) < new Date() ? 'completed' : 'active'
        };
      });
  }, [tasks, classes]);

  // Combine all tasks (published tasks + homeworks)
  const allTasks = [...publishedTasks, ...homeworkTasks];

  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || task.type === filter;
    return matchesSearch && matchesFilter;
  });

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
                <p>Create your first task to get started</p>
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
                      <span className={`quiz-status status-${task.status}`}>
                        {task.status}
                      </span>
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
                    <div className="quiz-stat-item">
                      <FiClock />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
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
      </main>
    </div>
  );
};

export default MyTasksPage;


