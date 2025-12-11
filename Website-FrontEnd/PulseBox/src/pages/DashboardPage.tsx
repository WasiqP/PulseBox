import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ThemeToggle';
import { useClasses } from '../context/ClassesContext';
<<<<<<< HEAD
import { FiBook, FiUsers, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
=======
import { useTasks } from '../context/TasksContext';
import { useAttendance } from '../context/AttendanceContext';
import { useSchedule } from '../context/ScheduleContext';
import { FiBook, FiUsers, FiCheckCircle, FiCalendar, FiClock, FiFileText, FiActivity, FiPlus, FiAlertCircle, FiTarget, FiEye } from 'react-icons/fi';
>>>>>>> cc12f29229db6759b4b5991214d2d8c4c9ed9b9d
import './DashboardPage.css';

const DashboardPage = () => {
  const { classes } = useClasses();
  
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  
  const stats = [
    { label: 'Total Classes', value: classes.length.toString(), icon: FiBook, color: '#A060FF' },
    { label: 'Total Students', value: totalStudents.toString(), icon: FiUsers, color: '#00E4E3' },
    { label: 'Attendance Today', value: '92%', icon: FiCheckCircle, color: '#4DFF88' },
    { label: 'Lesson Plans', value: '15', icon: FiCalendar, color: '#FF6B6B' },
  ];

  const recentClasses = classes.slice(0, 3).map(cls => ({
    id: cls.id,
    name: cls.name,
    classType: cls.classType,
    subject: cls.classType === 'single-subject' ? cls.subject : undefined,
    subjects: cls.classType === 'multi-subject' ? cls.subjects : undefined,
    students: cls.studentCount,
    attendance: '94%',
    lastActivity: '2 hours ago'
  }));

  const upcomingTasks = [
    { task: 'Mark attendance for Math Class', time: 'In 30 minutes', type: 'attendance' },
    { task: 'Review lesson plan for English', time: 'Tomorrow 9:00 AM', type: 'lesson' },
    { task: 'Grade Science assignments', time: 'Tomorrow 2:00 PM', type: 'grading' },
  ];

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
            <h1 className="dashboard-title">Overview</h1>
            <p className="dashboard-subtitle">Welcome back, John Doe</p>
          </motion.div>

          <div className="user-profile">
            <ThemeToggle />
            <Link to="/app/profile" style={{ textDecoration: 'none' }}>
              <div className="user-avatar">JD</div>
            </Link>
          </div>
        </div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="stat-card" glass={true}>
                <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </Card>
            );
          })}
        </motion.div>

        <div className="dashboard-content-grid">
          <motion.div
            className="recent-activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="section-heading">My Classes</h2>
            <div className="forms-list">
              {recentClasses.length > 0 ? (
                recentClasses.map((classItem) => (
                  <Link key={classItem.id} to={`/app/classes/${classItem.id}`} style={{ textDecoration: 'none' }}>
                    <Card className="form-item" glass={true} hoverEffect={true}>
                      <div className="form-info">
                        <h3 className="form-name">{classItem.name}</h3>
                        <span className="form-meta">
                          {classItem.students} students • {classItem.attendance} attendance • {classItem.lastActivity}
                        </span>
                      </div>
                      {classItem.classType === 'single-subject' && classItem.subject && (
                        <div className="class-badge">{classItem.subject}</div>
                      )}
                      {classItem.classType === 'multi-subject' && classItem.subjects && classItem.subjects.length > 0 && (
                        <div className="class-badge">
                          {classItem.subjects.slice(0, 1).map((s: { id: string; name: string }) => s.name).join(', ')}
                          {classItem.subjects.length > 1 && ` +${classItem.subjects.length - 1}`}
                        </div>
                      )}
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="form-item" glass={true}>
                  <div className="form-info">
                    <h3 className="form-name">No classes yet</h3>
                    <span className="form-meta">Create your first class to get started</span>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>

          <motion.div
            className="upcoming-tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="section-heading">Upcoming Tasks</h2>
            <Card className="tasks-card" glass={true}>
              <div className="tasks-list">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-icon-wrapper">
                      <FiClock />
                    </div>
                    <div className="task-info">
                      <p className="task-text">{task.task}</p>
                      <span className="task-time">{task.time}</span>
                    </div>
                    <span className={`task-type task-type-${task.type}`}>{task.type}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
<<<<<<< HEAD
=======
        )}

        {/* Attendance Summary Section */}
        {(() => {
          // Find classes that need attendance marked today
          const classesNeedingAttendance = classes.filter(cls => {
            const hasAttendanceToday = todayAttendanceRecords.some(r => r.classId === cls.id);
            return !hasAttendanceToday && cls.studentCount > 0;
          });

          if (classesNeedingAttendance.length > 0) {
            return (
              <motion.div
                className="attendance-summary-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                style={{ marginTop: '2rem' }}
              >
                <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
                  <FiCheckCircle style={{ marginRight: '0.5rem' }} />
                  Attendance Needed
                </h2>
                <Card className="attendance-summary-card" glass={true}>
                  <div className="attendance-summary-list">
                    {classesNeedingAttendance.slice(0, 5).map((cls) => (
                      <Link 
                        key={cls.id} 
                        to={`/app/mark-attendance?classId=${cls.id}`} 
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <div className="attendance-summary-item">
                          <div className="attendance-summary-icon" style={{ background: 'rgba(77, 255, 136, 0.15)', color: '#4DFF88' }}>
                            <FiBook />
                          </div>
                          <div className="attendance-summary-info">
                            <h4 className="attendance-summary-title">{cls.name}</h4>
                            <span className="attendance-summary-meta">
                              {cls.studentCount} students • Click to mark attendance
                            </span>
                          </div>
                          <div className="attendance-summary-action">
                            <FiCheckCircle style={{ fontSize: '1.2rem', color: '#4DFF88' }} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          }
          return null;
        })()}

        {/* Recent Tasks Section */}
        {(() => {
          const recentTasks = tasks
            .filter(task => task.published)
            .sort((a, b) => {
              const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
              const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5);

          if (recentTasks.length > 0) {
            return (
              <motion.div
                className="recent-tasks-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{ marginTop: '2rem' }}
              >
                <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
                  <FiFileText style={{ marginRight: '0.5rem' }} />
                  Recent Tasks
                </h2>
                <Card className="recent-tasks-card" glass={true}>
                  <div className="recent-tasks-list">
                    {recentTasks.map((task) => {
                      const classData = getClassById(task.classId);
                      const getTaskTypeColor = (type: string) => {
                        const colors: Record<string, string> = {
                          'quiz': '#A060FF',
                          'test': '#FF6B6B',
                          'assignment': '#4ECDC4',
                          'homework': '#FFD93D'
                        };
                        return colors[type] || '#7F8C8D';
                      };
                      
                      const taskColor = getTaskTypeColor(task.taskType);
                      const publishedDate = task.publishedAt ? new Date(task.publishedAt) : new Date(task.createdAt);
                      const timeAgo = formatRelativeTime(publishedDate.toISOString());
                      
                      return (
                        <div key={task.id} className="recent-task-item-wrapper">
                          <Link 
                            to={`/app/tasks/${task.id}`} 
                            style={{ textDecoration: 'none', display: 'block', flex: 1 }}
                          >
                            <div className="recent-task-item">
                              <div className="recent-task-icon" style={{ background: `${taskColor}20`, color: taskColor }}>
                                <FiFileText />
                              </div>
                              <div className="recent-task-info">
                                <h4 className="recent-task-title">{task.name}</h4>
                                <span className="recent-task-meta">
                                  {classData?.name || 'Unknown Class'} • {task.questions.length} questions • {timeAgo}
                                </span>
                              </div>
                              <div className="recent-task-badge" style={{ background: `${taskColor}20`, color: taskColor }}>
                                {task.taskType}
                              </div>
                            </div>
                          </Link>
                          <button
                            className="recent-task-preview-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(`/task/${task.id}`, '_blank');
                            }}
                            title="Preview Task"
                          >
                            <FiEye />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          }
          return null;
        })()}

        {/* Latest Activity Section */}
        <motion.div
          className="latest-activity-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: '2rem' }}
        >
          <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
            <FiActivity style={{ marginRight: '0.5rem' }} />
            Latest Activity
          </h2>
          <Card className="activity-card" glass={true}>
            {activities.length > 0 ? (
              <div className="activity-list">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <Link
                      key={activity.id}
                      to={
                        activity.type === 'task-created' && activity.taskId
                          ? `/app/tasks/${activity.taskId}`
                          : activity.classId
                          ? `/app/classes/${activity.classId}`
                          : '#'
                      }
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div className="activity-item">
                        <div 
                          className="activity-icon-wrapper"
                          style={{ 
                            background: `${activity.color}20`, 
                            color: activity.color 
                          }}
                        >
                          <Icon />
                        </div>
                        <div className="activity-content">
                          <p className="activity-title">{activity.title}</p>
                          <span className="activity-description">{activity.description}</span>
                        </div>
                        <span className="activity-time">{activity.relativeTime}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="empty-activity">
                <FiActivity style={{ fontSize: '2rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--color-text-muted)' }}>No recent activity</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  Create a task or mark attendance to see activity here
                </p>
>>>>>>> cc12f29229db6759b4b5991214d2d8c4c9ed9b9d
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
