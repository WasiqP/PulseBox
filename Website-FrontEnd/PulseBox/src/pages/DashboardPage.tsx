import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ThemeToggle';
import { useClasses } from '../context/ClassesContext';
import { useTasks } from '../context/TasksContext';
import { useAttendance } from '../context/AttendanceContext';
import { useSchedule } from '../context/ScheduleContext';
import { useResponses } from '../context/ResponsesContext';
import { FiBook, FiUsers, FiCheckCircle, FiCalendar, FiClock, FiFileText, FiActivity, FiPlus, FiAlertCircle, FiTarget, FiEye, FiInbox, FiCheck, FiX, FiAward, FiUser } from 'react-icons/fi';
import './DashboardPage.css';

const DashboardPage = () => {
  const { classes, getClassById } = useClasses();
  const { tasks, getTaskById } = useTasks();
  const { records: attendanceRecords } = useAttendance();
  const { events } = useSchedule();
  const { getLatestResponses } = useResponses();
  
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  
  // Get current date/time once for reuse
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Calculate real attendance for today
  const todayAttendanceRecords = attendanceRecords.filter(r => r.date === today);
  const todayAttendanceCount = todayAttendanceRecords.length;
  const todayAttendancePercentage = totalStudents > 0 
    ? Math.round((todayAttendanceCount / totalStudents) * 100) 
    : 0;

  // Get tasks due soon (next 7 days)
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const tasksDueSoon = tasks
    .filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= sevenDaysFromNow && task.published;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Get today's events
  const todayEvents = events
    .filter(event => {
      const eventDateStr = new Date(event.startTime).toISOString().split('T')[0];
      return eventDateStr === today;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const stats = [
    { label: 'Total Classes', value: classes.length.toString(), icon: FiBook, color: '#A060FF' },
    { label: 'Total Students', value: totalStudents.toString(), icon: FiUsers, color: '#00E4E3' },
    { label: 'Attendance Today', value: `${todayAttendancePercentage}%`, icon: FiCheckCircle, color: '#4DFF88' },
    { label: 'Tasks Due Soon', value: tasksDueSoon.length.toString(), icon: FiFileText, color: '#FF6B6B' },
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

  // Get upcoming events from schedule (next 7 days)
  const upcomingEventsSevenDays = new Date(now);
  upcomingEventsSevenDays.setDate(upcomingEventsSevenDays.getDate() + 7);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const upcomingEvents = events
    .filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= now && eventStart <= upcomingEventsSevenDays;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5); // Show top 5 upcoming events

  const formatEventTime = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInMs = eventDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return minutes <= 0 ? 'Now' : `In ${minutes} minutes`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `In ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (diffInDays < 2) {
      return `Tomorrow ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffInDays < 7) {
      return eventDate.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const getEventTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'class': 'Class',
      'meeting': 'Meeting',
      'office-hours': 'Office Hours',
      'grading': 'Grading',
      'lesson-planning': 'Lesson Planning',
      'professional-development': 'Professional Development',
      'personal': 'Personal',
      'other': 'Other'
    };
    return typeMap[type] || 'Event';
  };

  // Create activity feed from tasks and attendance
  interface ActivityItem {
    id: string;
    type: 'task-created' | 'attendance-marked';
    title: string;
    description: string;
    timestamp: string;
    relativeTime: string;
    classId?: string;
    taskId?: string;
    icon: typeof FiFileText | typeof FiCheckCircle;
    color: string;
  }

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const activities: ActivityItem[] = [
    // Task creation activities
    ...tasks
      .filter(task => task.createdAt)
      .map(task => {
        const classData = getClassById(task.classId);
        return {
          id: `task-${task.id}`,
          type: 'task-created' as const,
          title: `Created ${task.taskType}: ${task.name}`,
          description: classData ? `For ${classData.name}` : 'Task created',
          timestamp: task.createdAt,
          relativeTime: formatRelativeTime(task.createdAt),
          classId: task.classId,
          taskId: task.id,
          icon: FiFileText,
          color: '#A060FF'
        };
      }),
    
    // Attendance marking activities (group by class and date)
    ...Array.from(
      new Map(
        attendanceRecords
          .filter(record => record.createdAt)
          .map(record => {
            const key = `${record.classId}-${record.date}`;
            return [key, record];
          })
      ).values()
    )
      .map(record => {
        const classData = getClassById(record.classId);
        // Count students for this class/date
        const studentsCount = attendanceRecords.filter(
          r => r.classId === record.classId && r.date === record.date
        ).length;
        
        return {
          id: `attendance-${record.classId}-${record.date}`,
          type: 'attendance-marked' as const,
          title: `Marked attendance for ${studentsCount} students`,
          description: classData ? `${classData.name} • ${new Date(record.date).toLocaleDateString()}` : 'Attendance marked',
          timestamp: record.createdAt,
          relativeTime: formatRelativeTime(record.createdAt),
          classId: record.classId,
          icon: FiCheckCircle,
          color: '#4DFF88'
        };
      })
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Show latest 10 activities

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
            <h2 className="section-heading">Upcoming Events</h2>
            <Card className="tasks-card" glass={true}>
              {upcomingEvents.length > 0 ? (
              <div className="tasks-list">
                  {upcomingEvents.map((event) => {
                    const eventTypeConfig: Record<string, { color: string; icon: typeof FiCalendar }> = {
                      'class': { color: '#A060FF', icon: FiBook },
                      'meeting': { color: '#00E4E3', icon: FiUsers },
                      'office-hours': { color: '#4DFF88', icon: FiCheckCircle },
                      'grading': { color: '#FF6B6B', icon: FiFileText },
                      'lesson-planning': { color: '#FFD93D', icon: FiCalendar },
                      'professional-development': { color: '#9B59B6', icon: FiCalendar },
                      'personal': { color: '#95A5A6', icon: FiCalendar },
                      'other': { color: '#7F8C8D', icon: FiCalendar }
                    };
                    const config = eventTypeConfig[event.type] || { color: '#7F8C8D', icon: FiCalendar };
                    const Icon = config.icon;
                    
                    return (
                      <Link 
                        key={event.id} 
                        to="/app/schedule" 
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <div className="task-item">
                          <div className="task-icon-wrapper" style={{ background: `${config.color}20`, color: config.color }}>
                            <Icon />
                    </div>
                    <div className="task-info">
                            <p className="task-text">{event.title}</p>
                            <span className="task-time">{formatEventTime(event.startTime)}</span>
                          </div>
                          <span className="task-type" style={{ background: `${config.color}20`, color: config.color }}>
                            {getEventTypeLabel(event.type)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-tasks">
                  <FiCalendar style={{ fontSize: '2.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>No Upcoming Events</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Set up events in your schedule to see them here
                  </p>
                  <Link to="/app/schedule" style={{ textDecoration: 'none' }}>
                    <button 
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--color-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(160, 96, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <FiPlus />
                      <span>Go to Schedule</span>
                    </button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Today's Schedule Section */}
        {todayEvents.length > 0 && (
          <motion.div
            className="todays-schedule-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ marginTop: '2rem' }}
          >
            <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
              <FiClock style={{ marginRight: '0.5rem' }} />
              Today's Schedule
            </h2>
            <Card className="todays-schedule-card" glass={true}>
              <div className="todays-events-list">
                {todayEvents.map((event) => {
                  const eventStart = new Date(event.startTime);
                  const eventEnd = new Date(event.endTime);
                  const eventTypeConfig: Record<string, { color: string; icon: typeof FiCalendar }> = {
                    'class': { color: '#A060FF', icon: FiBook },
                    'meeting': { color: '#00E4E3', icon: FiUsers },
                    'office-hours': { color: '#4DFF88', icon: FiCheckCircle },
                    'grading': { color: '#FF6B6B', icon: FiFileText },
                    'lesson-planning': { color: '#FFD93D', icon: FiTarget },
                    'professional-development': { color: '#9B59B6', icon: FiCalendar },
                    'personal': { color: '#95A5A6', icon: FiCalendar },
                    'other': { color: '#7F8C8D', icon: FiCalendar }
                  };
                  const config = eventTypeConfig[event.type] || { color: '#7F8C8D', icon: FiCalendar };
                  const Icon = config.icon;
                  
                  return (
                    <Link 
                      key={event.id} 
                      to="/app/schedule" 
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div className="todays-event-item">
                        <div className="todays-event-time">
                          <span className="event-time-start">
                            {eventStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                          <span className="event-time-separator">-</span>
                          <span className="event-time-end">
                            {eventEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                        <div className="todays-event-content">
                          <div className="todays-event-icon" style={{ background: `${config.color}20`, color: config.color }}>
                            <Icon />
                          </div>
                          <div className="todays-event-info">
                            <h4 className="todays-event-title">{event.title}</h4>
                            {event.location && (
                              <span className="todays-event-location">{event.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tasks Due Soon Section */}
        {tasksDueSoon.length > 0 && (
          <motion.div
            className="tasks-due-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ marginTop: '2rem' }}
          >
            <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
              <FiAlertCircle style={{ marginRight: '0.5rem' }} />
              Tasks Due Soon
            </h2>
            <Card className="tasks-due-card" glass={true}>
              <div className="tasks-due-list">
                {tasksDueSoon.map((task) => {
                  const classData = getClassById(task.classId);
                  const dueDate = new Date(task.dueDate);
                  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  
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
                  
                  return (
                    <Link 
                      key={task.id} 
                      to={`/app/tasks/${task.id}`} 
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div className="task-due-item">
                        <div className="task-due-icon" style={{ background: `${taskColor}20`, color: taskColor }}>
                          <FiFileText />
                        </div>
                        <div className="task-due-info">
                          <h4 className="task-due-title">{task.name}</h4>
                          <span className="task-due-meta">
                            {classData?.name || 'Unknown Class'} • {task.questions.length} questions
                          </span>
                        </div>
                        <div className="task-due-date">
                          <span className={`due-badge ${daysUntilDue <= 1 ? 'urgent' : daysUntilDue <= 3 ? 'soon' : ''}`}>
                            {daysUntilDue === 0 ? 'Due Today' : daysUntilDue === 1 ? 'Due Tomorrow' : `Due in ${daysUntilDue} days`}
                          </span>
                          <span className="due-date-text">
                            {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                    </div>
                  </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>
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

        {/* Latest Responses Section */}
        {(() => {
          const latestResponses = getLatestResponses(5);

          if (latestResponses.length > 0) {
            return (
              <motion.div
                className="latest-responses-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{ marginTop: '2rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="section-heading" style={{ margin: 0 }}>
                    <FiInbox style={{ marginRight: '0.5rem' }} />
                    Latest Responses
                  </h2>
                  <Link 
                    to="/app/responses" 
                    style={{ 
                      color: 'var(--color-primary)', 
                      textDecoration: 'none', 
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    View All
                    <FiEye />
                  </Link>
                </div>
                <Card className="latest-responses-card" glass={true}>
                  <div className="latest-responses-list">
                    {latestResponses.map((response) => {
                      const task = getTaskById(response.taskId);
                      const classData = getClassById(response.classId);
                      const getTaskTypeColor = (type: string) => {
                        const colors: Record<string, string> = {
                          'quiz': '#A060FF',
                          'test': '#FF6B6B',
                          'assignment': '#4ECDC4',
                          'homework': '#FFD93D'
                        };
                        return colors[type] || '#7F8C8D';
                      };
                      
                      const taskColor = getTaskTypeColor(response.taskType);
                      const timeAgo = formatRelativeTime(response.submittedAt);
                      
                      return (
                        <Link
                          key={response.id}
                          to="/app/responses"
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <div className="latest-response-item">
                            <div className="response-icon-wrapper" style={{ background: `${taskColor}20`, color: taskColor }}>
                              <FiInbox />
                            </div>
                            <div className="response-content">
                              <div className="response-header">
                                <h4 className="response-task-name">{response.taskName}</h4>
                                <span className="response-type-badge" style={{ background: `${taskColor}20`, color: taskColor }}>
                                  {response.taskType}
                                </span>
                              </div>
                              <div className="response-meta-info">
                                {response.studentInfo && (
                                  <span className="response-student">
                                    <FiUser style={{ fontSize: '0.85rem' }} />
                                    {response.studentInfo.name}
                                  </span>
                                )}
                                {classData && (
                                  <span className="response-class">
                                    {classData.name}
                                  </span>
                                )}
                                <span className="response-time">{timeAgo}</span>
                              </div>
                              <div className="response-stats">
                                <span className="response-stat-item">
                                  {Object.keys(response.answers).length} / {task?.questions.length || 0} answered
                                </span>
                                {response.score !== undefined && task?.markingCriteria && (
                                  <>
                                    <span className="response-stat-item">
                                      <FiAward style={{ fontSize: '0.85rem' }} />
                                      {response.score.toFixed(1)} / {task.markingCriteria.totalMarks}
                                    </span>
                                    <span className={`response-status ${response.passed ? 'passed' : 'failed'}`}>
                                      {response.passed ? <FiCheck /> : <FiX />}
                                      {response.passed ? 'Passed' : 'Failed'}
                                    </span>
                                  </>
                                )}
                                {response.score === undefined && (
                                  <span className="response-status pending">
                                    Pending Review
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
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
        </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
