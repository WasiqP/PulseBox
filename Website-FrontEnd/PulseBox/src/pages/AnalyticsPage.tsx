import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiUsers, FiBook } from 'react-icons/fi';
import './DashboardPage.css';

const AnalyticsPage = () => {
  const analytics = [
    { label: 'Average Attendance Rate', value: '94.2%', change: '+2.5%', trend: 'up', icon: FiUsers },
    { label: 'Total Classes', value: '8', change: '+1', trend: 'up', icon: FiBook },
    { label: 'Active Students', value: '234', change: '+12', trend: 'up', icon: FiUsers },
    { label: 'Lesson Plans Created', value: '45', change: '+8', trend: 'up', icon: FiBarChart2 },
  ];

  const classPerformance = [
    { class: 'Mathematics - Grade 10', attendance: 94, avgGrade: 87, students: 28 },
    { class: 'English Literature', attendance: 92, avgGrade: 85, students: 24 },
    { class: 'Science Lab', attendance: 100, avgGrade: 90, students: 22 },
    { class: 'History', attendance: 88, avgGrade: 82, students: 26 },
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
            <h1 className="dashboard-title">Analytics</h1>
            <p className="dashboard-subtitle">Insights into your teaching performance</p>
          </motion.div>
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
              {classPerformance.map((item, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-class-info">
                    <h3 className="performance-class-name">{item.class}</h3>
                    <span className="performance-students">{item.students} students</span>
                  </div>
                  <div className="performance-metrics">
                    <div className="performance-metric">
                      <span className="metric-label">Attendance</span>
                      <span className="metric-value">{item.attendance}%</span>
                    </div>
                    <div className="performance-metric">
                      <span className="metric-label">Avg Grade</span>
                      <span className="metric-value">{item.avgGrade}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyticsPage;

