import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiCalendar, FiBook, FiClock, FiPlus, FiSearch } from 'react-icons/fi';
import './DashboardPage.css';

const LessonPlansPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const lessonPlans = [
    { id: 1, title: 'Introduction to Quadratic Equations', subject: 'Mathematics', grade: 'Grade 10', duration: '45 min', date: '2024-01-15', status: 'completed' },
    { id: 2, title: 'Shakespeare: Romeo and Juliet Analysis', subject: 'English', grade: 'Grade 11', duration: '60 min', date: '2024-01-16', status: 'scheduled' },
    { id: 3, title: 'Photosynthesis Process', subject: 'Science', grade: 'Grade 9', duration: '50 min', date: '2024-01-17', status: 'draft' },
    { id: 4, title: 'World War II Overview', subject: 'History', grade: 'Grade 10', duration: '45 min', date: '2024-01-18', status: 'scheduled' },
  ];

  const filteredPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="dashboard-title">Lesson Plans</h1>
            <p className="dashboard-subtitle">AI-powered lesson planning made easy</p>
          </motion.div>

          <Button variant="primary" size="md" leftIcon={<FiPlus />}>
            Create New Plan
          </Button>
        </div>

        <motion.div
          className="search-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search lesson plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </motion.div>

        <motion.div
          className="lesson-plans-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="lesson-plan-card" glass={true} hoverEffect={true}>
              <div className="lesson-plan-header">
                <div className="lesson-plan-icon">
                  <FiBook />
                </div>
                <span className={`lesson-plan-status status-${plan.status}`}>
                  {plan.status}
                </span>
              </div>
              <h3 className="lesson-plan-title">{plan.title}</h3>
              <div className="lesson-plan-meta">
                <div className="lesson-plan-meta-item">
                  <span className="meta-label">Subject:</span>
                  <span className="meta-value">{plan.subject}</span>
                </div>
                <div className="lesson-plan-meta-item">
                  <span className="meta-label">Grade:</span>
                  <span className="meta-value">{plan.grade}</span>
                </div>
                <div className="lesson-plan-meta-item">
                  <FiClock />
                  <span>{plan.duration}</span>
                </div>
                <div className="lesson-plan-meta-item">
                  <FiCalendar />
                  <span>{new Date(plan.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LessonPlansPage;

