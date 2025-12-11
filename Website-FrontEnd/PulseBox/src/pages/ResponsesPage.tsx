import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import { useResponses } from '../context/ResponsesContext';
import { useTasks } from '../context/TasksContext';
import { useClasses } from '../context/ClassesContext';
import {
  FiFileText,
  FiClock,
  FiUser,
  FiCheck,
  FiX,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import './ResponsesPage.css';

const ResponsesPage: React.FC = () => {
  const navigate = useNavigate();
  const { responses, getTaskStatistics, deleteResponse } = useResponses();
  const { getTaskById } = useTasks();
  const { classes } = useClasses();

  const [selectedTaskFilter, setSelectedTaskFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  // Get unique tasks from responses
  const uniqueTasks = useMemo(() => {
    const taskIds = [...new Set(responses.map(r => r.taskId))];
    return taskIds.map(id => getTaskById(id)).filter(Boolean);
  }, [responses, getTaskById]);

  // Filter responses
  const filteredResponses = useMemo(() => {
    let filtered = responses;

    // Filter by task
    if (selectedTaskFilter !== 'all') {
      filtered = filtered.filter(r => r.taskId === selectedTaskFilter);
    }

    // Filter by type
    if (selectedTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.taskType === selectedTypeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.taskName.toLowerCase().includes(query) ||
        r.studentInfo?.name.toLowerCase().includes(query) ||
        r.studentInfo?.email.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [responses, selectedTaskFilter, selectedTypeFilter, searchQuery]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalResponses = responses.length;
    const scoredResponses = responses.filter(r => r.score !== undefined);
    const averageScore = scoredResponses.length > 0
      ? scoredResponses.reduce((sum, r) => sum + (r.score || 0), 0) / scoredResponses.length
      : 0;
    const passedCount = responses.filter(r => r.passed === true).length;
    const passRate = scoredResponses.length > 0
      ? (passedCount / scoredResponses.length) * 100
      : 0;

    return {
      totalResponses,
      averageScore,
      passRate,
      uniqueTasks: uniqueTasks.length,
    };
  }, [responses, uniqueTasks]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return '#A060FF';
      case 'test': return '#FF6B6B';
      case 'assignment': return '#4ECDC4';
      case 'homework': return '#FFD93D';
      default: return '#A060FF';
    }
  };

  const getClassById = (classId: string) => {
    return classes.find(c => c.id === classId);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="responses-header">
            <div>
              <h1 className="page-title">Responses</h1>
              <p className="page-subtitle">View and manage all task submissions from students</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="responses-stats-grid">
            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: 'rgba(160, 96, 255, 0.1)' }}>
                <FiFileText style={{ color: '#A060FF' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{overallStats.totalResponses}</div>
                <div className="stat-label">Total Responses</div>
              </div>
            </Card>

            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: 'rgba(78, 205, 196, 0.1)' }}>
                <FiAward style={{ color: '#4ECDC4' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {overallStats.averageScore > 0 ? overallStats.averageScore.toFixed(1) : 'N/A'}
                </div>
                <div className="stat-label">Average Score</div>
              </div>
            </Card>

            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                <FiTrendingUp style={{ color: '#4CAF50' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{overallStats.passRate.toFixed(1)}%</div>
                <div className="stat-label">Pass Rate</div>
              </div>
            </Card>

            <Card className="stat-card" glass={true}>
              <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                <FiFileText style={{ color: '#FF6B6B' }} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{overallStats.uniqueTasks}</div>
                <div className="stat-label">Active Tasks</div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="responses-filters" glass={true}>
            <div className="filters-row">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search by task name, student name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <select
                  value={selectedTaskFilter}
                  onChange={(e) => setSelectedTaskFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Tasks</option>
                  {uniqueTasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="assignment">Assignment</option>
                  <option value="homework">Homework</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Responses List */}
          <div className="responses-list">
            {filteredResponses.length === 0 ? (
              <Card className="empty-state" glass={true}>
                <FiFileText className="empty-icon" />
                <h3>No Responses Found</h3>
                <p>
                  {searchQuery || selectedTaskFilter !== 'all' || selectedTypeFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No responses have been submitted yet. Share your tasks to start receiving responses.'}
                </p>
              </Card>
            ) : (
              filteredResponses.map((response) => {
                const task = getTaskById(response.taskId);
                const classData = getClassById(response.classId);
                const stats = getTaskStatistics(response.taskId);
                const isExpanded = expandedResponse === response.id;

                return (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="response-card" glass={true}>
                      <div className="response-card-header">
                        <div className="response-main-info">
                          <div className="response-task-info">
                            <div
                              className="task-type-badge"
                              style={{
                                background: `${getTaskTypeColor(response.taskType)}20`,
                                color: getTaskTypeColor(response.taskType),
                                borderColor: getTaskTypeColor(response.taskType),
                              }}
                            >
                              {response.taskType.charAt(0).toUpperCase() + response.taskType.slice(1)}
                            </div>
                            <h3 className="response-task-name">{response.taskName}</h3>
                          </div>

                          {classData && (
                            <div className="response-class-info">
                              <FiUser />
                              <span>{classData.name}</span>
                            </div>
                          )}

                          {response.studentInfo && (
                            <div className="response-student-info">
                              <FiUser />
                              <div>
                                <span className="student-name">{response.studentInfo.name}</span>
                                <span className="student-email">{response.studentInfo.email}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="response-meta">
                          <div className="response-time">
                            <FiClock />
                            <span>{formatDate(response.submittedAt)}</span>
                          </div>
                          {response.timeSpent && (
                            <div className="response-duration">
                              <span>Time: {formatTimeSpent(response.timeSpent)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="response-stats-row">
                        <div className="response-stat">
                          <span className="stat-label">Questions</span>
                          <span className="stat-value">
                            {Object.keys(response.answers).length} / {task?.questions.length || 0}
                          </span>
                        </div>

                        {response.score !== undefined && task?.markingCriteria && (
                          <>
                            <div className="response-stat">
                              <span className="stat-label">Score</span>
                              <span className="stat-value">
                                {response.score.toFixed(1)} / {task.markingCriteria.totalMarks}
                              </span>
                            </div>
                            <div className="response-stat">
                              <span className="stat-label">Percentage</span>
                              <span className="stat-value">{response.percentage?.toFixed(1)}%</span>
                            </div>
                            <div className="response-stat">
                              <span className="stat-label">Status</span>
                              <span className={`status-badge ${response.passed ? 'passed' : 'failed'}`}>
                                {response.passed ? (
                                  <>
                                    <FiCheck /> Passed
                                  </>
                                ) : (
                                  <>
                                    <FiX /> Failed
                                  </>
                                )}
                              </span>
                            </div>
                          </>
                        )}

                        {response.score === undefined && (
                          <div className="response-stat">
                            <span className="stat-label">Status</span>
                            <span className="status-badge pending">
                              Pending Review
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        className="expand-response-btn"
                        onClick={() => setExpandedResponse(isExpanded ? null : response.id)}
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Details</span>
                            <FiChevronDown />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <FiChevronRight />
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <motion.div
                          className="response-details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="response-answers-section">
                            <h4 className="section-title">Answers</h4>
                            <div className="answers-list">
                              {task?.questions.map((question, index) => {
                                const answer = response.answers[question.id];
                                const hasAnswer = answer && (
                                  Array.isArray(answer.value) ? answer.value.length > 0 : answer.value !== ''
                                );

                                return (
                                  <div key={question.id} className="answer-item">
                                    <div className="answer-question-header">
                                      <span className="answer-question-number">Q{index + 1}</span>
                                      <span className="answer-question-title">{question.title}</span>
                                      <span className="answer-question-type">{question.type}</span>
                                    </div>
                                    {hasAnswer ? (
                                      <div className="answer-content">
                                        {question.type === 'multipleChoice' && question.options && (
                                          <div className="answer-value">
                                            {question.options[parseInt(answer.value as string)]}
                                          </div>
                                        )}
                                        {question.type === 'checkbox' && question.options && (
                                          <div className="answer-value">
                                            {(answer.value as string[]).map(idx => 
                                              question.options?.[parseInt(idx)]
                                            ).filter(Boolean).join(', ')}
                                          </div>
                                        )}
                                        {question.type === 'dropdown' && question.options && (
                                          <div className="answer-value">
                                            {question.options[parseInt(answer.value as string)]}
                                          </div>
                                        )}
                                        {(question.type === 'shortText' || question.type === 'longText') && (
                                          <div className="answer-value">
                                            {answer.value as string}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="answer-empty">No answer provided</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {task && (
                            <div className="response-task-stats">
                              <h4 className="section-title">Task Statistics</h4>
                              <div className="task-stats-grid">
                                <div className="task-stat-item">
                                  <span className="task-stat-label">Total Responses</span>
                                  <span className="task-stat-value">{stats.totalResponses}</span>
                                </div>
                                {stats.averageScore !== undefined && (
                                  <div className="task-stat-item">
                                    <span className="task-stat-label">Average Score</span>
                                    <span className="task-stat-value">{stats.averageScore.toFixed(1)}</span>
                                  </div>
                                )}
                                {stats.passRate !== undefined && (
                                  <div className="task-stat-item">
                                    <span className="task-stat-label">Pass Rate</span>
                                    <span className="task-stat-value">{stats.passRate.toFixed(1)}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="response-actions">
                            <button
                              className="action-btn secondary"
                              onClick={() => navigate(`/app/tasks/${response.taskId}`)}
                            >
                              <FiEye />
                              <span>View Task</span>
                            </button>
                            <button
                              className="action-btn danger"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this response?')) {
                                  deleteResponse(response.id);
                                }
                              }}
                            >
                              <FiX />
                              <span>Delete</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResponsesPage;

