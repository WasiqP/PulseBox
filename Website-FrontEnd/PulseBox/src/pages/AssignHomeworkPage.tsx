import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useClasses } from '../context/ClassesContext';
import { useHomework } from '../context/HomeworkContext';
import {
  FiBook,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDownload,
  FiEye
} from 'react-icons/fi';
import './DashboardPage.css';

const AssignHomeworkPage = () => {
  const { classes } = useClasses();
  const { homeworks, addHomework, updateHomework, deleteHomework, getHomeworksByClass } = useHomework();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ isOpen: boolean; homeworkId: string; homeworkTitle: string }>({
    isOpen: false,
    homeworkId: '',
    homeworkTitle: ''
  });
  const [viewingHomework, setViewingHomework] = useState<string | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classHomeworks = selectedClassId ? getHomeworksByClass(selectedClassId) : [];
  const viewingHomeworkData = viewingHomework ? homeworks.find(h => h.id === viewingHomework) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxGrade: ''
  });

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      alert('Please select a class first');
      return;
    }

    addHomework({
      classId: selectedClassId,
      title: formData.title,
      description: formData.description,
      subject: selectedClass?.classType === 'single-subject' ? selectedClass.subject : undefined,
      dueDate: formData.dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      maxGrade: formData.maxGrade ? parseFloat(formData.maxGrade) : undefined,
      totalStudents: selectedClass?.studentCount || 0
    });

    setFormData({ title: '', description: '', dueDate: '', maxGrade: '' });
    setShowCreateModal(false);
  };

  const handleDeleteClick = (homeworkId: string, homeworkTitle: string) => {
    setShowDeleteModal({
      isOpen: true,
      homeworkId,
      homeworkTitle
    });
  };

  const handleDeleteConfirm = () => {
    deleteHomework(showDeleteModal.homeworkId);
    setShowDeleteModal({ isOpen: false, homeworkId: '', homeworkTitle: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubmissionStats = (homework: typeof classHomeworks[0]) => {
    const total = homework.totalStudents;
    const submitted = homework.submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
    const pending = total - submitted;
    const graded = homework.submissions.filter(s => s.status === 'graded').length;
    return { total, submitted, pending, graded };
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
            <h1 className="dashboard-title">Assign Homework</h1>
            <p className="dashboard-subtitle">Manage homework assignments and track student submissions</p>
          </motion.div>
        </div>

        {/* Class Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="homework-filter-card" glass={true}>
            <div className="homework-filter-content">
              <div className="form-group">
                <label htmlFor="classSelect">
                  <FiBook />
                  Select Class
                </label>
                <select
                  id="classSelect"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="homework-class-select"
                >
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.gradeLevel}
                    </option>
                  ))}
                </select>
              </div>
              {selectedClassId && (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<FiPlus />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Assign New Homework
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Homework List */}
        {selectedClassId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {classHomeworks.length > 0 ? (
              <div className="homework-list">
                {classHomeworks.map((homework) => {
                  const stats = getSubmissionStats(homework);
                  const isOverdue = new Date(homework.dueDate) < new Date() && stats.pending > 0;
                  
                  return (
                    <Card key={homework.id} className="homework-card" glass={true}>
                      <div className="homework-card-header">
                        <div className="homework-card-title-section">
                          <h3 className="homework-title">{homework.title}</h3>
                          {homework.subject && (
                            <span className="homework-subject-badge">{homework.subject}</span>
                          )}
                        </div>
                        <div className="homework-card-actions">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<FiEye />}
                            onClick={() => setViewingHomework(homework.id)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<FiEdit2 />}
                            onClick={() => {
                              // TODO: Implement edit functionality
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeleteClick(homework.id, homework.title)}
                            style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <p className="homework-description">{homework.description}</p>

                      <div className="homework-meta">
                        <div className="homework-meta-item">
                          <FiCalendar />
                          <span>Due: {formatDate(homework.dueDate)}</span>
                          {isOverdue && <span className="overdue-badge">Overdue</span>}
                        </div>
                        <div className="homework-meta-item">
                          <FiUsers />
                          <span>{stats.submitted}/{stats.total} Submitted</span>
                        </div>
                        {homework.maxGrade && (
                          <div className="homework-meta-item">
                            <FiFileText />
                            <span>Max Grade: {homework.maxGrade}</span>
                          </div>
                        )}
                      </div>

                      <div className="homework-progress">
                        <div className="homework-progress-bar">
                          <div
                            className="homework-progress-fill"
                            style={{ width: `${(stats.submitted / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="homework-progress-text">
                          {stats.submitted} submitted, {stats.pending} pending
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="empty-homework-card" glass={true}>
                <FiFileText className="empty-icon" />
                <h3>No Homework Assigned</h3>
                <p>Start by assigning homework to this class</p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<FiPlus />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Assign First Homework
                </Button>
              </Card>
            )}
          </motion.div>
        )}

        {/* Create Homework Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <motion.div
              className="modal-content homework-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Assign New Homework</h2>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
              </div>
              <form onSubmit={handleCreateHomework} className="homework-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Chapter 5 Exercises"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Describe the homework assignment..."
                  />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date *</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="maxGrade">Max Grade (Optional)</label>
                    <input
                      type="number"
                      id="maxGrade"
                      value={formData.maxGrade}
                      onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                      min="0"
                      step="0.1"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Assign Homework
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* View Homework Modal */}
        {viewingHomeworkData && (
          <div className="modal-overlay" onClick={() => setViewingHomework(null)}>
            <motion.div
              className="modal-content homework-view-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{viewingHomeworkData.title}</h2>
                <button className="modal-close" onClick={() => setViewingHomework(null)}>×</button>
              </div>
              <div className="homework-view-content">
                <div className="homework-view-section">
                  <h3>Details</h3>
                  <p>{viewingHomeworkData.description}</p>
                  <div className="homework-view-meta">
                    <div><strong>Due Date:</strong> {formatDate(viewingHomeworkData.dueDate)}</div>
                    {viewingHomeworkData.maxGrade && (
                      <div><strong>Max Grade:</strong> {viewingHomeworkData.maxGrade}</div>
                    )}
                  </div>
                </div>
                <div className="homework-view-section">
                  <h3>Submissions ({viewingHomeworkData.submissions.length}/{viewingHomeworkData.totalStudents})</h3>
                  {viewingHomeworkData.submissions.length > 0 ? (
                    <div className="submissions-list">
                      {viewingHomeworkData.submissions.map((submission) => (
                        <div key={submission.id} className="submission-item">
                          <div className="submission-header">
                            <div className="submission-student">
                              <div className="submission-avatar">
                                {submission.studentName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="submission-name">{submission.studentName}</div>
                                <div className="submission-email">{submission.studentEmail}</div>
                              </div>
                            </div>
                            <div className="submission-status">
                              {submission.status === 'submitted' && (
                                <span className="status-badge submitted">
                                  <FiCheckCircle /> Submitted
                                </span>
                              )}
                              {submission.status === 'graded' && (
                                <span className="status-badge graded">
                                  <FiCheckCircle /> Graded
                                </span>
                              )}
                              {submission.status === 'pending' && (
                                <span className="status-badge pending">
                                  <FiClock /> Pending
                                </span>
                              )}
                              {submission.status === 'late' && (
                                <span className="status-badge late">
                                  <FiXCircle /> Late
                                </span>
                              )}
                            </div>
                          </div>
                          {submission.submittedAt && (
                            <div className="submission-meta">
                              Submitted: {formatDate(submission.submittedAt)}
                              {submission.grade && (
                                <span className="submission-grade">Grade: {submission.grade}/{viewingHomeworkData.maxGrade}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-submissions">No submissions yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <ConfirmModal
          isOpen={showDeleteModal.isOpen}
          onClose={() => setShowDeleteModal({ isOpen: false, homeworkId: '', homeworkTitle: '' })}
          onConfirm={handleDeleteConfirm}
          title="Delete Homework"
          message={`Are you sure you want to delete "${showDeleteModal.homeworkTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </main>
    </div>
  );
};

export default AssignHomeworkPage;



