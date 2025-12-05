import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useClasses, formatSchedule } from '../context/ClassesContext';
import { FiBook, FiUsers, FiCalendar, FiPlus, FiSearch, FiEdit2, FiTrash2, FiCheckCircle, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import './DashboardPage.css';

const ClassesPage = () => {
  const { classes, deleteClass, getChildClasses, getTopLevelClasses } = useClasses();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; classId: string | null; className: string }>({
    isOpen: false,
    classId: null,
    className: ''
  });

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      classId: id,
      className: name
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.classId) {
      deleteClass(deleteModal.classId);
      setDeleteModal({
        isOpen: false,
        classId: null,
        className: ''
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      classId: null,
      className: ''
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/app/classes/edit/${id}`);
  };

  const toggleParentExpansion = (parentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedParents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  // Get top-level classes (parent classes or single-subject classes without parents)
  const topLevelClasses = getTopLevelClasses();

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
            <h1 className="dashboard-title">My Classes</h1>
            <p className="dashboard-subtitle">Manage all your classes in one place</p>
          </motion.div>

          <div className="dashboard-actions">
            <button className="search-btn">
              <FiSearch />
            </button>
            <Link to="/app/classes/create" className="create-class-btn">
              <FiPlus />
              <span>New Class</span>
            </Link>
          </div>
        </div>

        <motion.div
          className="classes-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {topLevelClasses.length === 0 ? (
            <div className="empty-state">
              <FiBook className="empty-icon" />
              <h3>No classes yet</h3>
              <p>Create your first class to get started</p>
              <Link to="/app/classes/create" className="create-class-btn">
                <FiPlus />
                <span>Create Your First Class</span>
              </Link>
            </div>
          ) : (
            topLevelClasses.map((classItem) => {
              const isParent = classItem.classType === 'multi-subject' && classItem.childClassIds && classItem.childClassIds.length > 0;
              const childClasses = isParent ? getChildClasses(classItem.id) : [];
              const isExpanded = expandedParents.has(classItem.id);
              
              return (
              <React.Fragment key={classItem.id}>
              <Card 
                key={classItem.id} 
                className="class-card" 
                glass={true} 
                hoverEffect={true}
                onMouseEnter={() => setHoveredCard(classItem.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="class-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    {isParent && (
                      <button
                        onClick={(e) => toggleParentExpansion(classItem.id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={isExpanded ? 'Collapse subjects' : 'Expand subjects'}
                      >
                        {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                      </button>
                    )}
                    <Link 
                      to={`/app/classes/${classItem.id}`} 
                      style={{ textDecoration: 'none', flex: 1 }}
                    >
                      <div className="class-header">
                        <div className="class-icon-wrapper">
                          <FiBook />
                        </div>
                      </div>
                      <h3 className="class-name">{classItem.name}</h3>
                    <div className="class-details">
                      <div className="class-detail-item">
                        <FiUsers />
                        <span>{classItem.studentCount} students</span>
                      </div>
                      <div className="class-detail-item">
                        <FiCalendar />
                        <span>{formatSchedule(classItem.schedule)}</span>
                      </div>
                      {classItem.roomNumber && (
                        <div className="class-detail-item">
                          <span className="class-room">{classItem.roomNumber}</span>
                        </div>
                      )}
                    </div>
                    <div className="class-footer">
                      {classItem.classType === 'single-subject' && classItem.subject && (
                        <div className="class-badge-small">{classItem.subject}</div>
                      )}
                      {classItem.classType === 'multi-subject' && classItem.subjects && (
                        <div className="subjects-badges-footer">
                          {classItem.subjects.slice(0, 2).map(subject => (
                            <div key={subject.id} className="class-badge-small">{subject.name}</div>
                          ))}
                          {classItem.subjects.length > 2 && (
                            <div className="class-badge-small">+{classItem.subjects.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                    </Link>
                  </div>
                  
                  <div className={`class-actions ${hoveredCard === classItem.id ? 'visible' : ''}`}>
                    <Link
                      to={`/app/mark-attendance?classId=${classItem.id}`}
                      className="class-action-btn mark-attendance-action-btn"
                      onClick={(e) => e.stopPropagation()}
                      title="Mark Attendance"
                    >
                      <FiCheckCircle />
                    </Link>
                    <button
                      className="class-action-btn edit-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(classItem.id);
                      }}
                      title="Edit Class"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="class-action-btn delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(classItem.id, classItem.name);
                      }}
                      title="Delete Class"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </Card>
              
              {/* Show child classes if parent is expanded */}
              {isParent && isExpanded && childClasses.length > 0 && (
                <div style={{ marginLeft: '2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {childClasses.map((childClass) => (
                    <Card 
                      key={childClass.id} 
                      className="class-card child-class-card" 
                      glass={true} 
                      hoverEffect={true}
                      onMouseEnter={() => setHoveredCard(childClass.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ borderLeft: '3px solid var(--color-primary)' }}
                    >
                      <div className="class-card-header">
                        <Link 
                          to={`/app/classes/${childClass.id}`} 
                          style={{ textDecoration: 'none', flex: 1 }}
                        >
                          <div className="class-header">
                            <div className="class-icon-wrapper">
                              <FiBook />
                            </div>
                          </div>
                          <h3 className="class-name">{childClass.name}</h3>
                          <div className="class-details">
                            <div className="class-detail-item">
                              <FiUsers />
                              <span>{childClass.studentCount} students</span>
                            </div>
                            <div className="class-detail-item">
                              <FiCalendar />
                              <span>{formatSchedule(childClass.schedule)}</span>
                            </div>
                            {childClass.roomNumber && (
                              <div className="class-detail-item">
                                <span className="class-room">{childClass.roomNumber}</span>
                              </div>
                            )}
                          </div>
                          <div className="class-footer">
                            {childClass.subject && (
                              <div className="class-badge-small">{childClass.subject}</div>
                            )}
                          </div>
                        </Link>
                        
                        <div className={`class-actions ${hoveredCard === childClass.id ? 'visible' : ''}`}>
                          <Link
                            to={`/app/mark-attendance?classId=${childClass.id}`}
                            className="class-action-btn mark-attendance-action-btn"
                            onClick={(e) => e.stopPropagation()}
                            title="Mark Attendance"
                          >
                            <FiCheckCircle />
                          </Link>
                          <button
                            className="class-action-btn edit-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(childClass.id);
                            }}
                            title="Edit Class"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="class-action-btn delete-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(childClass.id, childClass.name);
                            }}
                            title="Delete Class"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              </React.Fragment>
              );
            })
          )}
        </motion.div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Class"
          message={`Are you sure you want to delete "${deleteModal.className}"? This action cannot be undone and all associated data will be permanently removed.`}
          confirmText="Delete Class"
          cancelText="Cancel"
          type="danger"
        />
      </main>
    </div>
  );
};

export default ClassesPage;

