import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import { useClasses } from '../context/ClassesContext';
import { useAttendance } from '../context/AttendanceContext';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiCalendar, 
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import './DashboardPage.css';

const AttendancePage = () => {
  const { classes, getClassById } = useClasses();
  const { records, getAttendanceByClassAndDate, getAttendanceByClass } = useAttendance();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'late' | 'absent'>('all');
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());

  const selectedClass = selectedClassId ? getClassById(selectedClassId) : null;

  // Get filtered attendance records
  const filteredRecords = useMemo(() => {
    if (!selectedClassId) return [];

    let attendanceData = [];
    
    if (dateRange === 'today') {
      attendanceData = getAttendanceByClassAndDate(selectedClassId, selectedDate);
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const allClassRecords = getAttendanceByClass(selectedClassId);
      attendanceData = allClassRecords.filter(r => new Date(r.date) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const allClassRecords = getAttendanceByClass(selectedClassId);
      attendanceData = allClassRecords.filter(r => new Date(r.date) >= monthAgo);
    } else {
      attendanceData = getAttendanceByClass(selectedClassId);
    }

    // Filter by search query
    if (searchQuery) {
      attendanceData = attendanceData.filter(r => 
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      attendanceData = attendanceData.filter(r => r.status === statusFilter);
    }

    return attendanceData;
  }, [selectedClassId, selectedDate, dateRange, searchQuery, statusFilter, records]);

  // Group records by student
  const studentRecords = useMemo(() => {
    const grouped: Record<string, typeof filteredRecords> = {};
    filteredRecords.forEach(record => {
      if (!grouped[record.studentId]) {
        grouped[record.studentId] = [];
      }
      grouped[record.studentId].push(record);
    });
    return grouped;
  }, [filteredRecords]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!selectedClassId || filteredRecords.length === 0) {
      return {
        present: 0,
        late: 0,
        absent: 0,
        total: selectedClass?.studentCount || 0
      };
    }

    const uniqueStudents = new Set(filteredRecords.map(r => r.studentId));
    const latestRecords = Array.from(uniqueStudents).map(studentId => {
      const studentRecs = filteredRecords.filter(r => r.studentId === studentId);
      return studentRecs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    });

    return {
      present: latestRecords.filter(r => r.status === 'present').length,
      late: latestRecords.filter(r => r.status === 'late').length,
      absent: latestRecords.filter(r => r.status === 'absent').length,
      total: selectedClass?.studentCount || uniqueStudents.size
    };
  }, [filteredRecords, selectedClass]);

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <FiCheckCircle className="status-icon present" />;
      case 'late': return <FiClock className="status-icon late" />;
      case 'absent': return <FiXCircle className="status-icon absent" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#4DFF88';
      case 'late': return '#FFB84D';
      case 'absent': return '#FF6B6B';
      default: return 'var(--color-text-muted)';
    }
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
            <h1 className="dashboard-title">Attendance</h1>
            <p className="dashboard-subtitle">Track and manage student attendance records</p>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="attendance-filters-card" glass={true}>
            <div className="filters-header">
              <h2 className="filters-title">
                <FiFilter />
                Filters & Search
              </h2>
            </div>
            
            <div className="filters-grid">
              <div className="filter-group">
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
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.classType === 'single-subject' ? cls.subject : `${cls.subjects?.length || 0} Subjects`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="dateRange" className="form-label-with-icon">
                  <FiCalendar className="label-icon" />
                  <span>Date Range</span>
                </label>
                <div className="input-wrapper-select">
                  <select
                    id="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="class-select-input"
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>

              {dateRange === 'today' && (
                <div className="filter-group">
                  <label htmlFor="attendanceDate" className="form-label-with-icon">
                    <FiCalendar className="label-icon" />
                    <span>Date</span>
                  </label>
                  <div className="input-wrapper-date">
                    <input
                      type="date"
                      id="attendanceDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="date-input"
                    />
                    <FiCalendar className="date-icon" />
                  </div>
                </div>
              )}

              <div className="filter-group">
                <label htmlFor="statusFilter" className="form-label-with-icon">
                  <FiFilter className="label-icon" />
                  <span>Status</span>
                </label>
                <div className="input-wrapper-select">
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="class-select-input"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="search-group">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics */}
        {selectedClassId && (
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="stat-card" glass={true}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(77, 255, 136, 0.15)', color: '#4DFF88' }}>
                <FiCheckCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.present}</span>
                <span className="stat-label">Present</span>
              </div>
            </Card>
            <Card className="stat-card" glass={true}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 184, 77, 0.15)', color: '#FFB84D' }}>
                <FiClock />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.late}</span>
                <span className="stat-label">Late</span>
              </div>
            </Card>
            <Card className="stat-card" glass={true}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 107, 0.15)', color: '#FF6B6B' }}>
                <FiXCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
            </Card>
            <Card className="stat-card" glass={true}>
              <div className="stat-icon-wrapper" style={{ background: 'rgba(160, 96, 255, 0.15)', color: '#A060FF' }}>
                <FiUsers />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Student Attendance Records */}
        {selectedClassId ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="attendance-records-card" glass={true}>
              <div className="records-header">
                <h2 className="records-title">
                  {selectedClass?.name} - Attendance Records
                </h2>
                <span className="records-count">{Object.keys(studentRecords).length} students</span>
              </div>

              {Object.keys(studentRecords).length === 0 ? (
                <div className="empty-attendance-state">
                  <FiUsers className="empty-icon" />
                  <h3>No attendance records found</h3>
                  <p>No attendance has been marked for this class in the selected period.</p>
                </div>
              ) : (
                <div className="student-attendance-list">
                  {Object.entries(studentRecords).map(([studentId, records]) => {
                    const latestRecord = records.sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0];
                    const isExpanded = expandedStudents.has(studentId);
                    const attendanceHistory = records.sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    return (
                      <div key={studentId} className="student-attendance-item">
                        <div 
                          className="student-attendance-header"
                          onClick={() => toggleStudentExpansion(studentId)}
                        >
                          <div className="student-info-attendance">
                            <div className="student-avatar-attendance">
                              {latestRecord.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-details-attendance">
                              <span className="student-name-attendance">{latestRecord.studentName}</span>
                              <span className="student-email-attendance">{latestRecord.studentEmail}</span>
                            </div>
                          </div>
                          <div className="student-attendance-status">
                            {getStatusIcon(latestRecord.status)}
                            <span style={{ color: getStatusColor(latestRecord.status) }}>
                              {latestRecord.status.charAt(0).toUpperCase() + latestRecord.status.slice(1)}
                            </span>
                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="attendance-history">
                            <h4 className="history-title">Attendance History</h4>
                            <div className="history-list">
                              {attendanceHistory.map(record => (
                                <div key={record.id} className="history-item">
                                  <span className="history-date">
                                    {new Date(record.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <div className="history-status" style={{ color: getStatusColor(record.status) }}>
                                    {getStatusIcon(record.status)}
                                    <span>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="empty-state-card" glass={true}>
              <FiUsers className="empty-icon" />
              <h3>Select a Class</h3>
              <p>Choose a class from the dropdown above to view attendance records</p>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AttendancePage;
