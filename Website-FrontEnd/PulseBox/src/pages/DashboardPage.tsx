import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import { FiUsers, FiFileText, FiActivity, FiTrendingUp } from 'react-icons/fi';
import './DashboardPage.css';

const DashboardPage = () => {
  const stats = [
    { label: 'Total Forms', value: '12', icon: FiFileText, color: '#A060FF' },
    { label: 'Total Responses', value: '1,234', icon: FiUsers, color: '#00E4E3' },
    { label: 'Completion Rate', value: '85%', icon: FiActivity, color: '#FF6B6B' },
    { label: 'Growth', value: '+24%', icon: FiTrendingUp, color: '#4DFF88' },
  ];

  const recentForms = [
    { name: 'Customer Satisfaction Survey', responses: 342, status: 'Active', date: '2 hours ago' },
    { name: 'Product Feedback', responses: 128, status: 'Active', date: '1 day ago' },
    { name: 'Event Registration', responses: 56, status: 'Closed', date: '3 days ago' },
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
            <div className="user-avatar">JD</div>
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

        <motion.div
          className="recent-activity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="section-heading">Recent Forms</h2>
          <div className="forms-list">
            {recentForms.map((form, index) => (
              <Card key={index} className="form-item" glass={true} hoverEffect={true}>
                <div className="form-info">
                  <h3 className="form-name">{form.name}</h3>
                  <span className="form-meta">{form.responses} responses • {form.date}</span>
                </div>
                <span className={`form-status status-${form.status.toLowerCase()}`}>
                  {form.status}
                </span>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
