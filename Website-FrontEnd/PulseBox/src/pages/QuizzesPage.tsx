import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FiFileText, FiSearch, FiPlus, FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';
import './DashboardPage.css';

const QuizzesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quiz' | 'assignment' | 'test'>('all');

  const quizzes = [
    { 
      id: 1, 
      title: 'Algebra Basics Quiz', 
      type: 'quiz', 
      class: 'Mathematics - Grade 10', 
      questions: 15, 
      submissions: 24, 
      totalStudents: 28, 
      dueDate: '2024-01-20',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Shakespeare Analysis Assignment', 
      type: 'assignment', 
      class: 'English Literature', 
      questions: 5, 
      submissions: 18, 
      totalStudents: 24, 
      dueDate: '2024-01-22',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Midterm Exam - Science', 
      type: 'test', 
      class: 'Science Lab', 
      questions: 30, 
      submissions: 20, 
      totalStudents: 22, 
      dueDate: '2024-01-25',
      status: 'active'
    },
    { 
      id: 4, 
      title: 'History Chapter 5 Quiz', 
      type: 'quiz', 
      class: 'History', 
      questions: 10, 
      submissions: 22, 
      totalStudents: 26, 
      dueDate: '2024-01-18',
      status: 'completed'
    },
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || quiz.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return '#A060FF';
      case 'assignment': return '#00E4E3';
      case 'test': return '#FF6B6B';
      default: return '#A060FF';
    }
  };

  const getSubmissionRate = (submissions: number, total: number) => {
    return Math.round((submissions / total) * 100);
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
            <h1 className="dashboard-title">Quizzes & Tests</h1>
            <p className="dashboard-subtitle">Manage all your quizzes, assignments, and tests</p>
          </motion.div>

          <Link to="/app/quizzes/create">
            <Button variant="primary" size="md" leftIcon={<FiPlus />}>
              Create Quiz
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
                placeholder="Search quizzes..."
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
          </div>
        </motion.div>

        <motion.div
          className="quizzes-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredQuizzes.map((quiz) => (
            <Link key={quiz.id} to={`/app/quizzes/${quiz.id}`} style={{ textDecoration: 'none' }}>
              <Card className="quiz-card" glass={true} hoverEffect={true}>
                <div className="quiz-header">
                  <div className="quiz-type-badge" style={{ backgroundColor: `${getTypeColor(quiz.type)}20`, color: getTypeColor(quiz.type) }}>
                    {quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1)}
                  </div>
                  <span className={`quiz-status status-${quiz.status}`}>
                    {quiz.status}
                  </span>
                </div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-class">{quiz.class}</p>
                <div className="quiz-stats">
                  <div className="quiz-stat-item">
                    <FiFileText />
                    <span>{quiz.questions} Questions</span>
                  </div>
                  <div className="quiz-stat-item">
                    <FiUsers />
                    <span>{quiz.submissions}/{quiz.totalStudents} Submissions</span>
                  </div>
                  <div className="quiz-stat-item">
                    <FiClock />
                    <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="quiz-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${getSubmissionRate(quiz.submissions, quiz.totalStudents)}%`,
                        backgroundColor: getTypeColor(quiz.type)
                      }}
                    />
                  </div>
                  <span className="progress-text">{getSubmissionRate(quiz.submissions, quiz.totalStudents)}% Complete</span>
                </div>
              </Card>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default QuizzesPage;

