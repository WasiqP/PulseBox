import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTasks } from '../context/TasksContext';
import { useResponses } from '../context/ResponsesContext';
import { exportStudentReportToPDF, exportStudentReportToExcel, type StudentReportData } from '../utils/exportUtils';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiDownload,
} from 'react-icons/fi';
import './StudentProfilePage.css';

const StudentProfilePage: React.FC = () => {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();
  const navigate = useNavigate();
  const { getClassById } = useClasses();
  const { getStudentAttendance } = useAttendance();
  const { tasks, getTaskById } = useTasks();
  const { responses } = useResponses();

  const classData = classId ? getClassById(classId) : null;
  const student = classData?.students.find(s => s.id === studentId);

  // Get student's responses
  const studentResponses = useMemo(() => {
    if (!student) return [];
    return responses.filter(r => 
      r.studentInfo?.email === student.email || r.studentInfo?.name === student.name
    );
  }, [responses, student]);

  // Get student's attendance
  const attendanceRecords = useMemo(() => {
    if (!student || !classId) return [];
    return getStudentAttendance(student.id, classId);
  }, [student, classId, getStudentAttendance]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = classId ? tasks.filter(t => t.classId === classId).length : 0;
    const completedTasks = studentResponses.length;
    const gradedResponses = studentResponses.filter(r => r.isGraded && r.score !== undefined);
    const averageScore = gradedResponses.length > 0
      ? gradedResponses.reduce((sum, r) => sum + (r.percentage || 0), 0) / gradedResponses.length
      : undefined;

    // Calculate attendance rate
    const uniqueDates = [...new Set(attendanceRecords.map(r => r.date))];
    const presentCount = uniqueDates.reduce((count, date) => {
      const dateRecords = attendanceRecords.filter(r => r.date === date);
      return count + (dateRecords.some(r => r.status === 'present' || r.status === 'late') ? 1 : 0);
    }, 0);
    const attendanceRate = uniqueDates.length > 0 ? (presentCount / uniqueDates.length) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      averageScore,
      attendanceRate,
    };
  }, [classId, tasks, studentResponses, attendanceRecords]);

  // Prepare task data for display
  const taskData = useMemo(() => {
    return studentResponses.map(response => {
      const task = getTaskById(response.taskId);
      return {
        taskName: response.taskName,
        taskType: response.taskType,
        score: response.score,
        maxScore: task?.markingCriteria?.totalMarks || 100,
        percentage: response.percentage,
        passed: response.passed,
        submittedAt: response.submittedAt,
      };
    });
  }, [studentResponses, getTaskById]);

  const handleExportPDF = () => {
    if (!student || !classData) return;

    const reportData: StudentReportData = {
      studentName: student.name,
      studentEmail: student.email,
      className: classData.name,
      tasks: taskData,
      attendance: attendanceRecords.map(r => ({
        date: r.date,
        status: r.status,
      })),
      overallStats: {
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        averageScore: stats.averageScore,
        attendanceRate: stats.attendanceRate,
      },
    };

    exportStudentReportToPDF(reportData);
  };

  const handleExportExcel = () => {
    if (!student || !classData) return;

    const reportData: StudentReportData = {
      studentName: student.name,
      studentEmail: student.email,
      className: classData.name,
      tasks: taskData,
      attendance: attendanceRecords.map(r => ({
        date: r.date,
        status: r.status,
      })),
      overallStats: {
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        averageScore: stats.averageScore,
        attendanceRate: stats.attendanceRate,
      },
    };

    exportStudentReportToExcel(reportData);
  };

  if (!classData || !student) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Card className="error-card" glass={true}>
            <h2>Student Not Found</h2>
            <p>The student you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(classId ? `/app/classes/${classId}` : '/app/classes')}>
              Back to Class
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="student-profile-header">
          <button className="back-button" onClick={() => navigate(`/app/classes/${classId}`)}>
            <FiArrowLeft />
            <span>Back to Class</span>
          </button>
          <div className="header-info">
            <h1 className="page-title">Student Profile</h1>
            <p className="page-subtitle">{classData.name}</p>
          </div>
          <div className="export-buttons">
            <Button
              variant="secondary"
              onClick={handleExportPDF}
              leftIcon={<FiDownload />}
            >
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportExcel}
              leftIcon={<FiDownload />}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <div className="student-profile-content">
          {/* Student Info Card */}
          <Card className="student-info-card" glass={true}>
            <div className="student-info-header">
              <div className="student-avatar-large">
                <FiUser />
              </div>
              <div className="student-details">
                <h2 className="student-name">{student.name}</h2>
                <p className="student-email">
                  <FiMail />
                  {student.email}
                </p>
                <span className="class-badge">
                  <FiBook />
                  {classData.name}
                </span>
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: '#A060FF20', color: '#A060FF' }}>
                <FiFileText />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.completedTasks} / {stats.totalTasks}</div>
                <div className="stat-label">Tasks Completed</div>
              </div>
            </Card>

            {stats.averageScore !== undefined && (
              <Card className="stat-card" glass={true}>
                <div className="stat-icon" style={{ background: '#4ECDC420', color: '#4ECDC4' }}>
                  <FiAward />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.averageScore.toFixed(1)}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
              </Card>
            )}

            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: '#FFD93D20', color: '#FFD93D' }}>
                <FiClock />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.attendanceRate.toFixed(1)}%</div>
                <div className="stat-label">Attendance Rate</div>
              </div>
            </Card>
          </div>

          {/* Task Performance */}
          {taskData.length > 0 && (
            <Card className="tasks-section" glass={true}>
              <h2 className="section-title">Task Performance</h2>
              <div className="tasks-list">
                {taskData.map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-info">
                      <h3 className="task-name">{task.taskName}</h3>
                      <span className="task-type-badge">{task.taskType}</span>
                    </div>
                    <div className="task-stats">
                      {task.score !== undefined ? (
                        <>
                          <div className="task-score">
                            {task.score.toFixed(1)} / {task.maxScore}
                          </div>
                          {task.percentage !== undefined && (
                            <div className="task-percentage">{task.percentage.toFixed(1)}%</div>
                          )}
                          <div className={`task-status ${task.passed ? 'passed' : 'failed'}`}>
                            {task.passed ? <FiCheckCircle /> : <FiXCircle />}
                            {task.passed ? 'Passed' : 'Failed'}
                          </div>
                        </>
                      ) : (
                        <div className="task-status pending">Pending Review</div>
                      )}
                    </div>
                    <div className="task-date">
                      {new Date(task.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Attendance Record */}
          {attendanceRecords.length > 0 && (
            <Card className="attendance-section" glass={true}>
              <h2 className="section-title">Attendance Record</h2>
              <div className="attendance-list">
                {attendanceRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 20)
                  .map((record) => (
                    <div key={record.id} className="attendance-item">
                      <div className="attendance-date">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className={`attendance-status ${record.status}`}>
                        {record.status === 'present' && <FiCheckCircle />}
                        {record.status === 'late' && <FiClock />}
                        {record.status === 'absent' && <FiXCircle />}
                        <span>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                      </div>
                    </div>
                  ))}
                {attendanceRecords.length > 20 && (
                  <div className="attendance-more">
                    ... and {attendanceRecords.length - 20} more records
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentProfilePage;

