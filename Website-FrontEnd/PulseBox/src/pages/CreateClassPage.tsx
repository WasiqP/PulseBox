import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses, type Subject, type ClassSchedule } from '../context/ClassesContext';
import { FiBook, FiUsers, FiMapPin, FiArrowLeft, FiUserPlus, FiX, FiMail, FiUpload, FiPlus, FiCheck, FiClock, FiHome, FiGlobe } from 'react-icons/fi';
import './DashboardPage.css';

// Define Student type locally to avoid import issues
interface Student {
  id: string;
  name: string;
  email: string;
}

const CreateClassPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { addClass, updateClass, getClassById } = useClasses();
  const isEditMode = Boolean(id);
  const existingClass = id ? getClassById(id) : null;

  const [classType, setClassType] = useState<'single-subject' | 'multi-subject' | ''>('');
  const [educationLevel, setEducationLevel] = useState<'school' | 'college' | 'high-school' | 'university' | 'virtual' | 'other' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    gradeLevel: '',
    institutionName: '',
    location: '',
    roomNumber: ''
  });
  const [schedule, setSchedule] = useState<ClassSchedule>({
    startTime: '09:00',
    endTime: '10:00',
    days: []
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [showCSVInfo, setShowCSVInfo] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Grade levels based on education level
  const getGradeLevels = () => {
    switch (educationLevel) {
      case 'school':
        return ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
      case 'high-school':
        return ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
      case 'college':
        return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
      case 'university':
        return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate', 'Postgraduate'];
      case 'virtual':
        return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      case 'other':
        return ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
      default:
        return [];
    }
  };

  // Load existing class data if editing
  useEffect(() => {
    if (isEditMode && existingClass) {
      setClassType(existingClass.classType || 'single-subject');
      setEducationLevel(existingClass.educationLevel || 'school');
      setFormData({
        name: existingClass.name,
        subject: existingClass.subject || '',
        gradeLevel: existingClass.gradeLevel,
        institutionName: existingClass.institutionName || '',
        location: existingClass.location || '',
        roomNumber: existingClass.roomNumber || ''
      });
      // Handle schedule - could be string or ClassSchedule object
      if (typeof existingClass.schedule === 'string') {
        // Parse legacy string format (e.g., "Mon, Wed, Fri 9:00 AM")
        const scheduleStr = existingClass.schedule;
        const timeMatch = scheduleStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const period = timeMatch[3].toUpperCase();
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          setSchedule({
            startTime: `${hours.toString().padStart(2, '0')}:${minutes}`,
            endTime: `${(hours + 1).toString().padStart(2, '0')}:${minutes}`,
            days: weekDays.filter(day => scheduleStr.includes(day))
          });
        }
      } else {
        setSchedule(existingClass.schedule as ClassSchedule);
      }
      setSubjects(existingClass.subjects || []);
      setStudents(existingClass.students || []);
    }
  }, [isEditMode, existingClass]);

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name.trim(),
        description: newSubject.description.trim() || undefined
      };
      setSubjects([...subjects, subject]);
      setNewSubject({ name: '', description: '' });
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classType) {
      alert('Please select a class type');
      return;
    }

    if (!educationLevel) {
      alert('Please select an education level');
      return;
    }

    if (schedule.days.length === 0) {
      alert('Please select at least one day for the schedule');
      return;
    }

    const classData: any = {
      name: formData.name,
      classType: classType,
      educationLevel: educationLevel,
      gradeLevel: formData.gradeLevel,
      schedule: schedule,
      institutionName: formData.institutionName.trim() || undefined,
      location: formData.location.trim() || undefined,
      roomNumber: formData.roomNumber.trim() || undefined,
      students: students,
      studentCount: students.length
    };

    if (classType === 'single-subject') {
      if (!formData.subject.trim()) {
        alert('Please enter a subject name');
        return;
      }
      classData.subject = formData.subject;
    } else {
      if (subjects.length === 0) {
        alert('Please add at least one subject');
        return;
      }
      classData.subjects = subjects;
    }

    if (isEditMode && id) {
      updateClass(id, classData);
    } else {
      addClass(classData);
    }
    navigate('/app/classes');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddStudent = () => {
    if (newStudent.name.trim() && newStudent.email.trim()) {
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name.trim(),
        email: newStudent.email.trim()
      };
      setStudents([...students, student]);
      setNewStudent({ name: '', email: '' });
    }
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          alert('CSV file is empty');
          return;
        }
        
        // Detect header row
        const firstLine = lines[0].toLowerCase();
        const hasHeader = firstLine.includes('name') || firstLine.includes('email') || firstLine.includes('student');
        const startIndex = hasHeader ? 1 : 0;
        
        const csvStudents: Student[] = [];
        lines.slice(startIndex).forEach((line, index) => {
          // Handle both comma and semicolon separated values
          const delimiter = line.includes(';') ? ';' : ',';
          const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
          
          if (values.length >= 2) {
            // Try to find name and email columns (could be in any order)
            let name = '';
            let email = '';
            
            // Check if first column looks like email
            if (values[0].includes('@')) {
              email = values[0];
              name = values[1] || '';
            } else {
              name = values[0];
              email = values[1] || '';
            }
            
            // Validate email
            if (name && email && email.includes('@') && email.includes('.')) {
              csvStudents.push({
                id: `csv-${Date.now()}-${index}`,
                name: name,
                email: email
              });
            }
          }
        });

        if (csvStudents.length > 0) {
          setStudents([...students, ...csvStudents]);
          alert(`Successfully imported ${csvStudents.length} student(s) from CSV`);
        } else {
          alert('No valid students found in CSV file. Please check the format (Name, Email).');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error reading CSV file. Please check the format.');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
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
            <h1 className="dashboard-title">{isEditMode ? 'Edit Class' : 'Create New Class'}</h1>
            <p className="dashboard-subtitle">{isEditMode ? 'Update class information' : 'Add a new class to your dashboard'}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="create-class-card" glass={true}>
            <form className="create-class-form" onSubmit={handleSubmit}>
              {!isEditMode && (
                <div className="form-group">
                  <label>
                    <FiBook />
                    Class Type
                  </label>
                  <div className="class-type-selector">
                    <button
                      type="button"
                      className={`class-type-option ${classType === 'single-subject' ? 'active' : ''}`}
                      onClick={() => setClassType('single-subject')}
                    >
                      <FiCheck className="check-icon" />
                      <div>
                        <span className="option-title">Single Subject Class</span>
                        <span className="option-desc">One subject per class (e.g., Mathematics for Grade 10)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`class-type-option ${classType === 'multi-subject' ? 'active' : ''}`}
                      onClick={() => setClassType('multi-subject')}
                    >
                      <FiCheck className="check-icon" />
                      <div>
                        <span className="option-title">Multi-Subject Class</span>
                        <span className="option-desc">Multiple subjects in one class (e.g., Grade 1 with Maths & English)</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">
                  <FiBook />
                  Class Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={classType === 'single-subject' ? "e.g., Mathematics - Grade 10" : "e.g., Grade 1"}
                />
              </div>

              {classType === 'single-subject' && (
                <div className="form-group">
                  <label htmlFor="subject">
                    <FiBook />
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required={classType === 'single-subject'}
                    placeholder="e.g., Mathematics, English, Science"
                  />
                </div>
              )}

              {classType === 'multi-subject' && (
                <div className="form-group">
                  <label>
                    <FiBook />
                    Subjects
                  </label>
                  <div className="subjects-input-section">
                    <div className="add-subject-inputs">
                      <input
                        type="text"
                        placeholder="Subject name (e.g., Mathematics)"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubject();
                          }
                        }}
                        className="subject-name-input"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleAddSubject}
                        leftIcon={<FiPlus />}
                      >
                        Add Subject
                      </Button>
                    </div>
                    {subjects.length > 0 && (
                      <div className="subjects-list">
                        {subjects.map((subject) => (
                          <div key={subject.id} className="subject-badge-item">
                            <span className="subject-badge-name">{subject.name}</span>
                            <button
                              type="button"
                              className="remove-subject-btn"
                              onClick={() => handleRemoveSubject(subject.id)}
                              title="Remove subject"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="educationLevel">
                  <FiBook />
                  Education Level
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={educationLevel}
                  onChange={(e) => {
                    setEducationLevel(e.target.value as any);
                    setFormData({ ...formData, gradeLevel: '' }); // Reset grade level when education level changes
                  }}
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="school">School</option>
                  <option value="high-school">High School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="virtual">Virtual/Online</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {educationLevel && (
                <div className="form-group">
                  <label htmlFor="gradeLevel">
                    <FiUsers />
                    Grade/Level
                  </label>
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select {educationLevel === 'virtual' ? 'Level' : 'Grade/Level'}</option>
                    {getGradeLevels().map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>
                  <FiClock />
                  Schedule
                </label>
                <div className="schedule-inputs">
                  <div className="time-inputs">
                    <div className="time-input-group">
                      <label htmlFor="startTime">Start Time</label>
                      <input
                        type="time"
                        id="startTime"
                        value={schedule.startTime}
                        onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="time-input-group">
                      <label htmlFor="endTime">End Time</label>
                      <input
                        type="time"
                        id="endTime"
                        value={schedule.endTime}
                        onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="days-selector">
                    <label>Select Days</label>
                    <div className="days-checkboxes">
                      {weekDays.map(day => (
                        <label key={day} className="day-checkbox-label">
                          <input
                            type="checkbox"
                            checked={schedule.days.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSchedule({ ...schedule, days: [...schedule.days, day] });
                              } else {
                                setSchedule({ ...schedule, days: schedule.days.filter(d => d !== day) });
                              }
                            }}
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="institutionName">
                  <FiHome />
                  Institution Name (Optional)
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder="e.g., ABC High School"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  <FiGlobe />
                  Location (Optional)
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomNumber">
                  <FiMapPin />
                  Room Number (Optional)
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g., Room 201"
                />
              </div>
            </form>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="students-section-card" glass={true}>
              <div className="students-section-header">
                <div>
                  <h2 className="students-section-title">Add Students</h2>
                  <p className="students-section-subtitle">
                    Add students to this class ({students.length} added)
                  </p>
                </div>
                <div className="csv-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    style={{ display: 'none' }}
                    id="csv-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setShowCSVInfo(!showCSVInfo)}
                    leftIcon={<FiUpload />}
                  >
                    Import CSV
                  </Button>
                </div>
              </div>

              <div className="add-student-form">
                <div className="add-student-inputs">
                  <div className="form-group">
                    <label htmlFor="studentName">
                      <FiUsers className="label-icon" />
                      Student Name
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="studentName"
                        name="name"
                        value={newStudent.name}
                        onChange={handleStudentInputChange}
                        placeholder="e.g., John Doe"
                        className="student-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddStudent();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentEmail">
                      <FiMail className="label-icon" />
                      Email
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="studentEmail"
                        name="email"
                        value={newStudent.email}
                        onChange={handleStudentInputChange}
                        placeholder="e.g., john.doe@school.edu"
                        className="student-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddStudent();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleAddStudent}
                    leftIcon={<FiUserPlus />}
                  >
                    Add Student
                  </Button>
                </div>
              </div>

              {showCSVInfo && (
                <motion.div
                  className="csv-info-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="csv-info-content">
                    <h3 className="csv-info-title">How to Import Students from CSV</h3>
                    <p className="csv-info-text">
                      To add multiple students at once, create a CSV file with the following format:
                    </p>
                    <div className="csv-example">
                      <code className="csv-code">
                        Name, Email<br />
                        John Doe, john.doe@school.edu<br />
                        Jane Smith, jane.smith@school.edu<br />
                        Bob Johnson, bob.johnson@school.edu
                      </code>
                    </div>
                    <ul className="csv-instructions">
                      <li>First row can be a header (Name, Email) - we'll auto-detect it</li>
                      <li>Each row should contain: Student Name, Email Address</li>
                      <li>Separate values with commas or semicolons</li>
                      <li>We'll automatically extract and add all students to your class</li>
                    </ul>
                    <div className="csv-info-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCSVInfo(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setShowCSVInfo(false);
                          setTimeout(() => {
                            fileInputRef.current?.click();
                          }, 200);
                        }}
                      >
                        Upload CSV File
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {students.length > 0 && (
                <div className="students-list">
                  <h3 className="students-list-title">Students ({students.length})</h3>
                  <div className="students-grid">
                    {students.map((student) => (
                      <div key={student.id} className="student-card">
                        <div className="student-info">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="student-details">
                            <span className="student-name">{student.name}</span>
                            <span className="student-email">{student.email}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="remove-student-btn"
                          onClick={() => handleRemoveStudent(student.id)}
                          aria-label="Remove student"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-actions">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/app/classes')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                >
                  {isEditMode ? 'Update Class' : 'Create Class'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateClassPage;

