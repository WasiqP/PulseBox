import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses, formatSchedule } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiXCircle, FiArrowLeft, FiSave } from 'react-icons/fi';
import './DashboardPage.css';

type AttendanceStatus = 'present' | 'late' | 'absent';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: AttendanceStatus;
}

const MarkAttendancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { classes, getClassById, updateClass } = useClasses();
  const { addAttendanceRecords } = useAttendance();
  const classIdFromUrl = searchParams.get('classId') || '';
  const [selectedClassId, setSelectedClassId] = useState<string>(classIdFromUrl);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const selectedClass = selectedClassId ? getClassById(selectedClassId) : null;

  // Initialize attendance records when class is selected
  React.useEffect(() => {
    if (selectedClass && selectedClass.students) {
      const records: AttendanceRecord[] = selectedClass.students.map(student => ({
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        status: 'present' as AttendanceStatus
      }));
      setAttendanceRecords(records);
    } else if (selectedClass && selectedClass.studentCount > 0) {
      // If class has studentCount but no students array, create placeholder records
      const records: AttendanceRecord[] = Array.from({ length: selectedClass.studentCount }, (_, i) => ({
        studentId: `placeholder-${i}`,
        studentName: `Student ${i + 1}`,
        studentEmail: `student${i + 1}@school.edu`,
        status: 'present' as AttendanceStatus
      }));
      setAttendanceRecords(records);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedClassId, selectedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSave = async () => {
    if (!selectedClass) return;

    setIsSaving(true);
    
    try {
      // Save attendance records
      const recordsToSave = attendanceRecords.map(record => ({
        classId: selectedClass.id,
        date: attendanceDate,
        studentId: record.studentId,
        studentName: record.studentName,
        studentEmail: record.studentEmail,
        status: record.status
      }));

      addAttendanceRecords(recordsToSave);
      
      setTimeout(() => {
        alert(`Attendance marked successfully for ${selectedClass.name} on ${attendanceDate}`);
        setIsSaving(false);
        navigate('/app/attendance');
      }, 500);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
      setIsSaving(false);
    }
  };

  const getStatusCounts = () => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    return { present, late, absent, total: attendanceRecords.length };
  };

  const stats = getStatusCounts();

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
            <h1 className="dashboard-title">Mark Attendance</h1>
            <p className="dashboard-subtitle">Record attendance for your students</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="attendance-control-card" glass={true}>
            <div className="attendance-controls">
              <div className="form-group">
                <label htmlFor="classSelect" className="form-label-with-icon">
                  <FiUsers className="label-icon" />
                  <span>Select Class</span>
                </label>
                <div className="input-wrapper-select">
                  <select
                    id="classSelect"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="class-select-input"
                  >
                    <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.classType === 'single-subject' ? cls.subject : `${cls.subjects?.length || 0} Subjects`} ({cls.studentCount} students)
                    </option>
                  ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attendanceDate" className="form-label-with-icon">
                  <FiCalendar className="label-icon" />
                  <span>Date</span>
                </label>
                <div className="input-wrapper-date">
                  <input
                    type="date"
                    id="attendanceDate"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="date-input"
                  />
                  <FiCalendar className="date-icon" />
                </div>
              </div>
            </div>

            {selectedClass && (
              <div className="class-info">
                {selectedClass.classType === 'single-subject' && selectedClass.subject && (
                  <div className="class-info-item">
                    <span className="class-info-label">Subject:</span>
                    <span className="class-info-value">{selectedClass.subject}</span>
                  </div>
                )}
                {selectedClass.classType === 'multi-subject' && selectedClass.subjects && (
                  <div className="class-info-item">
                    <span className="class-info-label">Subjects:</span>
                    <div className="subjects-badges-list">
                      {selectedClass.subjects.map(subject => (
                        <span key={subject.id} className="subject-badge-display">
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="class-info-item">
                  <span className="class-info-label">Grade Level:</span>
                  <span className="class-info-value">{selectedClass.gradeLevel}</span>
                </div>
                <div className="class-info-item">
                  <span className="class-info-label">Schedule:</span>
                  <span className="class-info-value">{formatSchedule(selectedClass.schedule)}</span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {selectedClass && attendanceRecords.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="attendance-stats-card" glass={true}>
                <div className="attendance-stats">
                  <div className="stat-item present-stat">
                    <FiCheckCircle />
                    <div>
                      <span className="stat-value">{stats.present}</span>
                      <span className="stat-label">Present</span>
                    </div>
                  </div>
                  <div className="stat-item late-stat">
                    <FiClock />
                    <div>
                      <span className="stat-value">{stats.late}</span>
                      <span className="stat-label">Late</span>
                    </div>
                  </div>
                  <div className="stat-item absent-stat">
                    <FiXCircle />
                    <div>
                      <span className="stat-value">{stats.absent}</span>
                      <span className="stat-label">Absent</span>
                    </div>
                  </div>
                  <div className="stat-item total-stat">
                    <FiUsers />
                    <div>
                      <span className="stat-value">{stats.total}</span>
                      <span className="stat-label">Total</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="attendance-list-card" glass={true}>
                <h2 className="attendance-list-title">Student Attendance</h2>
                <div className="attendance-list">
                  {attendanceRecords.map((record, index) => (
                    <div key={record.studentId} className="attendance-item">
                      <div className="student-info-attendance">
                        <div className="student-avatar-attendance">
                          {record.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div className="student-details-attendance">
                          <span className="student-name-attendance">{record.studentName}</span>
                          <span className="student-email-attendance">{record.studentEmail}</span>
                        </div>
                      </div>
                      <div className="attendance-buttons">
                        <button
                          className={`attendance-btn present-btn ${record.status === 'present' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(record.studentId, 'present')}
                        >
                          <FiCheckCircle />
                          <span>Present</span>
                        </button>
                        <button
                          className={`attendance-btn late-btn ${record.status === 'late' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(record.studentId, 'late')}
                        >
                          <FiClock />
                          <span>Late</span>
                        </button>
                        <button
                          className={`attendance-btn absent-btn ${record.status === 'absent' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(record.studentId, 'absent')}
                        >
                          <FiXCircle />
                          <span>Absent</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="attendance-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/app/classes')}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleSave}
                  disabled={isSaving}
                  leftIcon={<FiSave />}
                >
                  {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>
            </motion.div>
          </>
        )}

        {selectedClass && attendanceRecords.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="empty-attendance-card" glass={true}>
              <FiUsers className="empty-icon" />
              <h3>No Students Found</h3>
              <p>This class doesn't have any students yet. Add students to the class first.</p>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => navigate(`/app/classes/edit/${selectedClassId}`)}
              >
                Add Students to Class
              </Button>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MarkAttendancePage;

