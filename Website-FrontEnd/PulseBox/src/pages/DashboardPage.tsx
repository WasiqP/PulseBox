import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ThemeToggle';
import { useClasses } from '../context/ClassesContext';
import { FiBook, FiUsers, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
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
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
