import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses, formatSchedule } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { useHomework } from '../context/HomeworkContext';
import { 
  FiBook, 
  FiUsers, 
  FiCalendar, 
  FiMapPin, 
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText,
  FiTrendingUp,
  FiMail,
  FiUser,
  FiEdit
} from 'react-icons/fi';
import ConfirmModal from '../components/ui/ConfirmModal';
import './DashboardPage.css';

const ClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, getClassById, deleteClass, removeStudentFromClass, getChildClasses, getParentClass } = useClasses();
  const { getAttendanceByClass } = useAttendance();
  const { getHomeworksByClass } = useHomework();
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, classId: '', className: '' });
  const [deleteStudentModal, setDeleteStudentModal] = useState({ isOpen: false, studentId: '', studentName: '' });
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const classData = id ? getClassById(id) : null;
  const attendanceRecords = id ? getAttendanceByClass(id) : [];
  const parentClass = classData ? getParentClass(classData.id) : null;
  const childClasses = classData && classData.classType === 'multi-subject' ? getChildClasses(classData.id) : [];
  
  // Mock quizzes/tests/assignments data (in a real app, this would come from a QuizzesContext)
  const allQuizzes = [
    { id: '1', classId: '1', type: 'quiz', title: 'Algebra Basics Quiz' },
    { id: '2', classId: '1', type: 'test', title: 'Midterm Exam' },
    { id: '3', classId: '2', type: 'assignment', title: 'Shakespeare Analysis' },
    { id: '4', classId: '2', type: 'quiz', title: 'Grammar Quiz' },
    { id: '5', classId: '3', type: 'test', title: 'Science Test' },
  ];
  
  const classQuizzes = id ? allQuizzes.filter(q => q.classId === id) : [];
  const quizzesCount = classQuizzes.filter(q => q.type === 'quiz').length;
  const testsCount = classQuizzes.filter(q => q.type === 'test').length;
  const assignmentsCount = classQuizzes.filter(q => q.type === 'assignment').length;
  const homeworks = id ? getHomeworksByClass(id) : [];
  const homeworkCount = homeworks.length;

  if (!classData) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <FiBook className="empty-icon" />
            <h3>Class Not Found</h3>
            <p>The class you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate('/app/classes')}>
              Back to Classes
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      classId: classData.id,
      className: classData.name
    });
  };

  const handleDeleteConfirm = () => {
    deleteClass(classData.id);
    navigate('/app/classes');
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    setDeleteStudentModal({
      isOpen: true,
      studentId,
      studentName
    });
  };

  const handleDeleteStudentConfirm = () => {
    if (classData && deleteStudentModal.studentId) {
      removeStudentFromClass(classData.id, deleteStudentModal.studentId);
      setDeleteStudentModal({ isOpen: false, studentId: '', studentName: '' });
    }
  };

  // Calculate attendance stats
  const latestAttendance = attendanceRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  const attendanceStats = latestAttendance ? {
    present: attendanceRecords.filter(r => r.date === latestAttendance.date && r.status === 'present').length,
    late: attendanceRecords.filter(r => r.date === latestAttendance.date && r.status === 'late').length,
    absent: attendanceRecords.filter(r => r.date === latestAttendance.date && r.status === 'absent').length,
    date: latestAttendance.date
  } : null;

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
              onClick={() => navigate('/app/classes')}
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
                fontSize: '0.9rem'
              }}
            >
              <FiArrowLeft />
              <span>Back to Classes</span>
            </button>
            <div className="class-details-header">
              <div>
                <h1 className="dashboard-title">{classData.name}</h1>
                <p className="dashboard-subtitle">
                  {classData.classType === 'single-subject' 
                    ? `${classData.subject} • ${classData.gradeLevel}`
                    : `${classData.gradeLevel} • ${classData.subjects?.length || 0} Subjects`
                  }
                </p>
              </div>
              <div className="class-details-actions">
                <Link to={`/app/mark-attendance?classId=${classData.id}`}>
                  <Button variant="primary" size="md" leftIcon={<FiCheckCircle />}>
                    Mark Attendance
                  </Button>
                </Link>
                <Link to={`/app/classes/edit/${classData.id}`}>
                  <Button variant="outline" size="md" leftIcon={<FiEdit2 />}>
                    Edit Class
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="md" 
                  leftIcon={<FiTrash2 />}
                  onClick={handleDelete}
                  style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Parent/Child Class Navigation */}
        {(parentClass || childClasses.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '2rem' }}
          >
            <Card glass={true}>
              {parentClass && (
                <div style={{ marginBottom: childClasses.length > 0 ? '1.5rem' : '0' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Parent Class
                  </h3>
                  <Link 
                    to={`/app/classes/${parentClass.id}`}
                    style={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(160, 96, 255, 0.1)',
                      border: '1px solid rgba(160, 96, 255, 0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(160, 96, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(160, 96, 255, 0.1)';
                    }}
                  >
                    <FiBook style={{ color: 'var(--color-primary)' }} />
                    <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{parentClass.name}</span>
                    <FiArrowLeft style={{ marginLeft: 'auto', transform: 'rotate(180deg)', color: 'var(--color-text-muted)' }} />
                  </Link>
                </div>
              )}
              {childClasses.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Subject Classes ({childClasses.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {childClasses.map((child) => (
                      <Link 
                        key={child.id}
                        to={`/app/classes/${child.id}`}
                        style={{ 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          background: 'rgba(160, 96, 255, 0.05)',
                          border: '1px solid rgba(160, 96, 255, 0.1)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(160, 96, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(160, 96, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(160, 96, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(160, 96, 255, 0.1)';
                        }}
                      >
                        <FiBook style={{ color: 'var(--color-primary)', fontSize: '0.875rem' }} />
                        <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>{child.name}</span>
                        {child.subject && (
                          <span style={{ 
                            marginLeft: 'auto',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(160, 96, 255, 0.1)',
                            borderRadius: '4px',
                            color: 'var(--color-primary)'
                          }}>
                            {child.subject}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="stat-card" glass={true}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(160, 96, 255, 0.15)', color: '#A060FF' }}>
              <FiUsers />
            </div>
            <div className="stat-info">
              <span className="stat-value">{classData.studentCount}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </Card>
          <Card className="stat-card" glass={true}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(160, 96, 255, 0.15)', color: '#A060FF' }}>
              <FiFileText />
            </div>
            <div className="stat-info">
              <span className="stat-value">{quizzesCount}</span>
              <span className="stat-label">Quizzes</span>
            </div>
          </Card>
          <Card className="stat-card" glass={true}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B' }}>
              <FiBook />
            </div>
            <div className="stat-info">
              <span className="stat-value">{testsCount}</span>
              <span className="stat-label">Tests</span>
            </div>
          </Card>
          <Card className="stat-card" glass={true}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 228, 227, 0.15)', color: '#00E4E3' }}>
              <FiEdit />
            </div>
            <div className="stat-info">
              <span className="stat-value">{assignmentsCount}</span>
              <span className="stat-label">Assignments</span>
            </div>
          </Card>
          <Card className="stat-card" glass={true}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(77, 255, 136, 0.15)', color: '#4DFF88' }}>
              <FiCheckCircle />
            </div>
            <div className="stat-info">
              <span className="stat-value">{homeworkCount}</span>
              <span className="stat-label">Homework</span>
            </div>
          </Card>
        </motion.div>

        <div className="class-details-grid">
          {/* Class Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="class-info-detail-card" glass={true}>
              <div className="card-header">
                <h3 className="card-title">
                  <FiBook />
                  Class Information
                </h3>
              </div>
              <div className="class-info-details">
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    <FiCalendar />
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Schedule</span>
                    <span className="info-detail-value">{formatSchedule(classData.schedule)}</span>
                  </div>
                </div>
                {classData.roomNumber && (
                  <div className="info-detail-item">
                    <div className="info-detail-icon">
                      <FiMapPin />
                    </div>
                    <div className="info-detail-content">
                      <span className="info-detail-label">Room Number</span>
                      <span className="info-detail-value">{classData.roomNumber}</span>
                    </div>
                  </div>
                )}
                <div className="info-detail-item">
                  <div className="info-detail-icon">
                    <FiUsers />
                  </div>
                  <div className="info-detail-content">
                    <span className="info-detail-label">Grade Level</span>
                    <span className="info-detail-value">{classData.gradeLevel}</span>
                  </div>
                </div>
                {classData.classType === 'single-subject' && (
                  <div className="info-detail-item">
                    <div className="info-detail-icon">
                      <FiBook />
                    </div>
                    <div className="info-detail-content">
                      <span className="info-detail-label">Subject</span>
                      <span className="info-detail-value">{classData.subject}</span>
                    </div>
                  </div>
                )}
                {classData.classType === 'multi-subject' && classData.subjects && (
                  <div className="info-detail-item">
                    <div className="info-detail-icon">
                      <FiBook />
                    </div>
                    <div className="info-detail-content">
                      <span className="info-detail-label">Subjects</span>
                      <div className="subjects-badges-list">
                        {classData.subjects.map(subject => (
                          <span key={subject.id} className="subject-badge-display">
                            {subject.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Students List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="class-students-card" glass={true}>
              <div className="card-header">
                <h3 className="card-title">
                  <FiUsers />
                  Students ({classData.students.length || classData.studentCount})
                </h3>
                <Link to={`/app/classes/edit/${classData.id}`}>
                  <Button variant="outline" size="sm" leftIcon={<FiUser />}>
                    Add a Student
                  </Button>
                </Link>
              </div>
              {classData.students && classData.students.length > 0 ? (
                <>
                  <div className={`students-list-detailed ${classData.students.length > 4 ? 'students-list-collapsed' : ''}`}>
                    {classData.students.slice(0, 4).map((student, index) => {
                      // Blur the last 1-2 students when showing 4
                      const isBlurred = classData.students.length > 4 && index >= 2;
                      return (
                        <div key={student.id} className={`student-item-detailed ${isBlurred ? 'student-item-blurred' : ''}`}>
                          <div className="student-avatar-detailed">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="student-info-detailed">
                            <span className="student-name-detailed">{student.name}</span>
                            <span className="student-email-detailed">{student.email}</span>
                          </div>
                          {!isBlurred && (
                            <button
                              className="delete-student-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStudent(student.id, student.name);
                              }}
                              aria-label={`Delete ${student.name}`}
                              title={`Delete ${student.name}`}
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {classData.students.length > 4 && (
                    <div className="students-view-more-container">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setShowStudentsModal(true)}
                        className="students-view-more-btn"
                      >
                        View More ({classData.students.length - 4} more)
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-students-state">
                  <FiUsers className="empty-icon" />
                  <p>No students added yet</p>
                  <Link to={`/app/classes/edit/${classData.id}`}>
                    <Button variant="primary" size="sm">
                      Add Students
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Recent Attendance */}
        {attendanceStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="class-attendance-card" glass={true}>
              <div className="card-header">
                <h3 className="card-title">
                  <FiCheckCircle />
                  Latest Attendance
                </h3>
                <Link to={`/app/attendance?classId=${classData.id}`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="attendance-summary">
                <div className="attendance-date-info">
                  <FiCalendar />
                  <span>{new Date(attendanceStats.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="attendance-summary-stats">
                  <div className="summary-stat present">
                    <FiCheckCircle />
                    <span>{attendanceStats.present} Present</span>
                  </div>
                  <div className="summary-stat late">
                    <FiClock />
                    <span>{attendanceStats.late} Late</span>
                  </div>
                  <div className="summary-stat absent">
                    <FiXCircle />
                    <span>{attendanceStats.absent} Absent</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Students Full Screen Modal */}
        {showStudentsModal && (
          <div className="modal-overlay" onClick={() => setShowStudentsModal(false)}>
            <motion.div
              className="modal-content students-fullscreen-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2>All Students - {classData.name}</h2>
                  <p className="modal-subtitle">{classData.students.length} students</p>
                </div>
                <button className="modal-close" onClick={() => setShowStudentsModal(false)}>×</button>
              </div>
              <div className="students-fullscreen-list">
                {classData.students.map((student) => (
                  <div key={student.id} className="student-item-detailed">
                    <div className="student-avatar-detailed">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-info-detailed">
                      <span className="student-name-detailed">{student.name}</span>
                      <span className="student-email-detailed">{student.email}</span>
                    </div>
                    <button
                      className="delete-student-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student.id, student.name);
                        setShowStudentsModal(false);
                      }}
                      aria-label={`Delete ${student.name}`}
                      title={`Delete ${student.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, classId: '', className: '' })}
          onConfirm={handleDeleteConfirm}
          title="Delete Class"
          message={`Are you sure you want to delete "${deleteModal.className}"? This action cannot be undone and all associated data will be permanently removed.`}
          confirmText="Delete Class"
          cancelText="Cancel"
          type="danger"
        />

        <ConfirmModal
          isOpen={deleteStudentModal.isOpen}
          onClose={() => setDeleteStudentModal({ isOpen: false, studentId: '', studentName: '' })}
          onConfirm={handleDeleteStudentConfirm}
          title="Delete Student"
          message={`Are you sure you want to remove "${deleteStudentModal.studentName}" from this class? This action cannot be undone.`}
          confirmText="Delete Student"
          cancelText="Cancel"
          type="danger"
        />
      </main>
    </div>
  );
};

export default ClassDetailsPage;

