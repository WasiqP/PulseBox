import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import { useClasses } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { useTasks } from '../context/TasksContext';
import { useResponses } from '../context/ResponsesContext';
import { exportClassAnalyticsToPDF } from '../utils/exportUtils';
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiUsers, FiBook, FiFileText, FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import './DashboardPage.css';

const AnalyticsPage = () => {
  const { classes, getClassById } = useClasses();
  const { records: attendanceRecords } = useAttendance();
  const { tasks } = useTasks();
  const { responses, getTaskStatistics } = useResponses();

  // Calculate real analytics data
  const analytics = useMemo(() => {
    // Calculate average attendance rate
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
    const presentCount = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const attendanceRate = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    // Total classes
    const totalClasses = classes.length;

    // Active students (total across all classes)
    const activeStudents = totalStudents;

    // Total tasks created (as proxy for lesson plans/assignments)
    const totalTasks = tasks.length;

    return [
      { 
        label: 'Average Attendance Rate', 
        value: `${attendanceRate.toFixed(1)}%`, 
        change: attendanceRate > 0 ? '+0%' : '0%', 
        trend: attendanceRate >= 80 ? 'up' : 'down', 
        icon: FiUsers 
      },
      { 
        label: 'Total Classes', 
        value: totalClasses.toString(), 
        change: totalClasses > 0 ? `+${totalClasses}` : '0', 
        trend: 'up', 
        icon: FiBook 
      },
      { 
        label: 'Active Students', 
        value: activeStudents.toString(), 
        change: activeStudents > 0 ? `+${activeStudents}` : '0', 
        trend: 'up', 
        icon: FiUsers 
      },
      { 
        label: 'Tasks Created', 
        value: totalTasks.toString(), 
        change: totalTasks > 0 ? `+${totalTasks}` : '0', 
        trend: 'up', 
        icon: FiFileText 
      },
    ];
  }, [classes, attendanceRecords, tasks]);

  // Calculate class performance with real data
  const classPerformance = useMemo(() => {
    return classes.map(classData => {
      // Calculate attendance for this class
      const classAttendanceRecords = attendanceRecords.filter(r => r.classId === classData.id);
      const uniqueDates = [...new Set(classAttendanceRecords.map(r => r.date))];
      let totalAttendanceDays = 0;
      let totalPossibleAttendance = 0;

      uniqueDates.forEach(date => {
        const dateRecords = classAttendanceRecords.filter(r => r.date === date);
        const presentCount = dateRecords.filter(r => r.status === 'present' || r.status === 'late').length;
        totalAttendanceDays += presentCount;
        totalPossibleAttendance += classData.studentCount;
      });

      const attendancePercentage = totalPossibleAttendance > 0 
        ? (totalAttendanceDays / totalPossibleAttendance) * 100 
        : 0;

      // Calculate average grade for this class
      const classTasks = tasks.filter(t => t.classId === classData.id);
      let totalScore = 0;
      let scoredResponsesCount = 0;

      classTasks.forEach(task => {
        const taskResponses = responses.filter(r => r.taskId === task.id);
        taskResponses.forEach(response => {
          if (response.score !== undefined) {
            totalScore += response.score;
            scoredResponsesCount++;
          }
        });
      });

      const avgGrade = scoredResponsesCount > 0 
        ? (totalScore / scoredResponsesCount) 
        : 0;

      // Convert to percentage if task has marking criteria
      const avgGradePercentage = classTasks.length > 0 && classTasks[0]?.markingCriteria
        ? (avgGrade / classTasks[0].markingCriteria.totalMarks) * 100
        : avgGrade;

      return {
        class: classData.name,
        attendance: Math.round(attendancePercentage),
        avgGrade: Math.round(avgGradePercentage),
        students: classData.studentCount,
        classId: classData.id,
      };
    }).filter(cp => cp.students > 0) // Only show classes with students
      .sort((a, b) => b.attendance - a.attendance); // Sort by attendance
  }, [classes, attendanceRecords, tasks, responses]);

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
            <h1 className="dashboard-title">Analytics</h1>
            <p className="dashboard-subtitle">Insights into your teaching performance</p>
          </motion.div>
          <div className="analytics-export-buttons">
            <button
              className="export-btn"
              onClick={() => {
                const data = [
                  ['Class Name', 'Students', 'Attendance %', 'Avg Grade %'],
                  ...classPerformance.map(cp => [
                    cp.class,
                    cp.students,
                    cp.attendance + '%',
                    cp.avgGrade > 0 ? cp.avgGrade + '%' : 'N/A',
                  ]),
                ];
                const worksheet = XLSX.utils.aoa_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Performance');
                XLSX.writeFile(workbook, `Class_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
              }}
              title="Export to Excel"
            >
              <FiDownload />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {analytics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="stat-card" glass={true}>
                <div className="stat-icon-wrapper" style={{ background: '#A060FF20', color: '#A060FF' }}>
                  <Icon />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                  <div className={`stat-change ${stat.trend}`}>
                    {stat.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        <motion.div
          className="analytics-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="performance-card" glass={true}>
            <h2 className="section-heading">Class Performance Overview</h2>
            <div className="performance-list">
              {classPerformance.length > 0 ? (
                classPerformance.map((item) => (
                  <div key={item.classId} className="performance-item">
                    <div className="performance-class-info">
                      <h3 className="performance-class-name">{item.class}</h3>
                      <span className="performance-students">{item.students} {item.students === 1 ? 'student' : 'students'}</span>
                    </div>
                    <div className="performance-metrics">
                      <div className="performance-metric">
                        <span className="metric-label">Attendance</span>
                        <span className="metric-value">{item.attendance}%</span>
                      </div>
                      <div className="performance-metric">
                        <span className="metric-label">Avg Grade</span>
                        <span className="metric-value">{item.avgGrade > 0 ? `${item.avgGrade}%` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-performance">
                  <p>No class performance data available yet. Create classes and start tracking attendance and grades to see analytics.</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyticsPage;



