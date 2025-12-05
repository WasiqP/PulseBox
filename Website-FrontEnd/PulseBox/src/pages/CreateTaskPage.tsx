import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useClasses } from '../context/ClassesContext';
import { useTasks } from '../context/TasksContext';
import { useAlert } from '../context/AlertModalContext';
import { FiFileText, FiBook, FiClock, FiLock, FiArrowLeft, FiCheck, FiX, FiAward, FiPercent, FiMinus, FiGlobe, FiUsers } from 'react-icons/fi';
import './DashboardPage.css';

type TaskType = 'quiz' | 'test' | 'assignment' | 'homework';

interface MarkingCriteria {
  totalMarks: number;
  passingMarks: number;
  passingPercentage: number;
  negativeMarking: boolean;
  negativeMarkingValue: number; // Marks deducted per wrong answer
  autoGrade: boolean;
  markingScheme: 'equal' | 'weighted'; // Equal marks per question or weighted
}

interface TaskFormData {
  name: string;
  taskType: TaskType | '';
  classId: string;
  subjectId?: string; // For multi-subject classes
  dueDate: string;
  expectedTime: number;
  timeUnit: 'minutes' | 'hours';
  visibility: 'public' | 'class-only'; // Task visibility/sharing preference
  markingCriteria?: MarkingCriteria;
  permissions: {
    lockScreen: boolean;
    preventTabSwitch: boolean;
    preventCopyPaste: boolean;
    showTimer: boolean;
  };
}

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { classes } = useClasses();
  const { addTask } = useTasks();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format for default
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    taskType: '',
    classId: '',
    subjectId: '',
    dueDate: getTodayDate(),
    expectedTime: 30,
    timeUnit: 'minutes',
    visibility: 'public',
    markingCriteria: {
      totalMarks: 100,
      passingMarks: 40,
      passingPercentage: 40,
      negativeMarking: false,
      negativeMarkingValue: 0.25,
      autoGrade: true,
      markingScheme: 'equal'
    },
    permissions: {
      lockScreen: false,
      preventTabSwitch: false,
      preventCopyPaste: false,
      showTimer: true
    }
  });

  const selectedClass = formData.classId ? classes.find(c => c.id === formData.classId) : null;
  const isMultiSubject = selectedClass?.classType === 'multi-subject';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (permission: keyof TaskFormData['permissions']) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleMarkingCriteriaChange = (field: keyof MarkingCriteria, value: any) => {
    setFormData(prev => ({
      ...prev,
      markingCriteria: {
        ...(prev.markingCriteria || {
          totalMarks: 100,
          passingMarks: 40,
          passingPercentage: 40,
          negativeMarking: false,
          negativeMarkingValue: 0.25,
          autoGrade: true,
          markingScheme: 'equal'
        }),
        [field]: value
      }
    }));
  };

  const calculatePassingMarks = (totalMarks: number, percentage: number) => {
    return Math.round((totalMarks * percentage) / 100);
  };

  const handleTotalMarksChange = (value: number) => {
    const currentPercentage = formData.markingCriteria?.passingPercentage || 40;
    const newPassingMarks = calculatePassingMarks(value, currentPercentage);
    handleMarkingCriteriaChange('totalMarks', value);
    handleMarkingCriteriaChange('passingMarks', newPassingMarks);
  };

  const handlePassingPercentageChange = (value: number) => {
    const totalMarks = formData.markingCriteria?.totalMarks || 100;
    const newPassingMarks = calculatePassingMarks(totalMarks, value);
    handleMarkingCriteriaChange('passingPercentage', value);
    handleMarkingCriteriaChange('passingMarks', newPassingMarks);
  };

  const showMarkingCriteria = formData.taskType === 'quiz' || formData.taskType === 'test' || formData.taskType === 'assignment';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.name) {
      showAlert({
        title: 'Required Field Missing',
        message: 'Please enter a task name before proceeding.',
        buttonText: 'OK'
      });
      return false;
    }

    if (!formData.taskType) {
      showAlert({
        title: 'Required Field Missing',
        message: 'Please select a task type (Quiz, Test, Assignment, or Homework) before proceeding.',
        buttonText: 'OK'
      });
      return false;
    }

    if (!formData.classId) {
      showAlert({
        title: 'Required Field Missing',
        message: 'Please select a class before proceeding.',
        buttonText: 'OK'
      });
      return false;
    }

    if (!formData.dueDate) {
      showAlert({
        title: 'Required Field Missing',
        message: 'Please select a due date before proceeding.',
        buttonText: 'OK'
      });
      return false;
    }

    if (isMultiSubject && !formData.subjectId) {
      showAlert({
        title: 'Required Field Missing',
        message: 'Please select a subject for this multi-subject class before proceeding.',
        buttonText: 'OK'
      });
      return false;
    }

    setIsLoading(true);
    
    // Create task and get task ID
    const taskId = addTask({
      name: formData.name,
      taskType: formData.taskType as 'quiz' | 'test' | 'assignment' | 'homework',
      classId: formData.classId,
      subjectId: formData.subjectId,
      dueDate: formData.dueDate,
      expectedTime: formData.expectedTime,
      timeUnit: formData.timeUnit,
      visibility: formData.visibility,
      markingCriteria: formData.markingCriteria,
      permissions: formData.permissions,
    });
    
    setIsLoading(false);
    
    // Use setTimeout to ensure state has updated before navigation
    setTimeout(() => {
      navigate(`/app/tasks/${taskId}/questions`);
    }, 100);
    
    return false;
  };

  const handleContinueClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e as any);
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'quiz':
        return <FiFileText />;
      case 'test':
        return <FiBook />;
      case 'assignment':
        return <FiFileText />;
      case 'homework':
        return <FiBook />;
      default:
        return <FiFileText />;
    }
  };

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case 'quiz':
        return '#A060FF';
      case 'test':
        return '#FF6B6B';
      case 'assignment':
        return '#4ECDC4';
      case 'homework':
        return '#FFD93D';
      default:
        return '#A060FF';
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
            <button 
              onClick={() => navigate(-1)}
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
                fontSize: '0.9rem',
                padding: 0
              }}
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="dashboard-title">Create Task</h1>
            <p className="dashboard-subtitle">Set up a new quiz, test, assignment, or homework</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="create-task-card" glass={true}>
            <form onSubmit={handleSubmit} className="create-task-form" noValidate>
              {/* Task Type Selection */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">
                    Task Type <span className="required">*</span>
                  </h2>
                  <p className="section-description">Select the type of task you want to create</p>
                </div>
                <div className="task-type-grid">
                  {(['quiz', 'test', 'assignment', 'homework'] as TaskType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`task-type-card ${formData.taskType === type ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, taskType: type }))}
                      style={{
                        borderColor: formData.taskType === type ? getTaskTypeColor(type) : 'var(--color-border)',
                        background: formData.taskType === type 
                          ? `linear-gradient(135deg, ${getTaskTypeColor(type)}15 0%, ${getTaskTypeColor(type)}05 100%)`
                          : 'transparent'
                      }}
                    >
                      <div className="task-type-icon" style={{ color: getTaskTypeColor(type) }}>
                        {getTaskTypeIcon(type)}
                      </div>
                      <span className="task-type-label">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                      {formData.taskType === type && (
                        <div className="task-type-check">
                          <FiCheck />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Basic Information</h2>
                  <p className="section-description">Provide essential details about the task</p>
                </div>
                <div className="form-group">
                  <label htmlFor="name">
                    Task Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Algebra Quiz - Chapter 5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="classId">
                    Class <span className="required">*</span>
                  </label>
                  <select
                    id="classId"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {isMultiSubject && (
                  <div className="form-group">
                    <label htmlFor="subjectId">
                      Subject <span className="required">*</span>
                    </label>
                    <select
                      id="subjectId"
                      name="subjectId"
                      value={formData.subjectId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      {selectedClass?.subjects?.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!isMultiSubject && selectedClass?.subject && (
                  <div className="form-group">
                    <label>Subject</label>
                    <div className="info-display">
                      <FiBook />
                      <span>{selectedClass.subject}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule & Timing */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Schedule & Timing</h2>
                  <p className="section-description">Set due date and expected completion time</p>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dueDate">
                      Due Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expectedTime">
                      Expected Time to Complete
                    </label>
                    <div className="time-input-group">
                      <input
                        type="number"
                        id="expectedTime"
                        name="expectedTime"
                        value={formData.expectedTime}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          expectedTime: parseInt(e.target.value) || 0 
                        }))}
                        min="1"
                        placeholder="30"
                        className="time-input"
                      />
                      <select
                        name="timeUnit"
                        value={formData.timeUnit}
                        onChange={handleChange}
                        className="time-unit-select"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility & Sharing */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Visibility & Sharing</h2>
                  <p className="section-description">Choose who can access this task</p>
                </div>
                <div className="visibility-options">
                  <button
                    type="button"
                    className={`visibility-option ${formData.visibility === 'public' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                  >
                    <div className="visibility-icon">
                      <FiGlobe />
                    </div>
                    <div className="visibility-content">
                      <h3>Public</h3>
                      <p>Share with everyone via link, QR code, and social media</p>
                    </div>
                    {formData.visibility === 'public' && (
                      <div className="visibility-check">
                        <FiCheck />
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`visibility-option ${formData.visibility === 'class-only' ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, visibility: 'class-only' }))}
                  >
                    <div className="visibility-icon">
                      <FiUsers />
                    </div>
                    <div className="visibility-content">
                      <h3>Only with Created Classes</h3>
                      <p>Share only with students in your classes via email</p>
                    </div>
                    {formData.visibility === 'class-only' && (
                      <div className="visibility-check">
                        <FiCheck />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Marking Criteria - Only for Quiz, Test, Assignment */}
              {showMarkingCriteria && (
                <div className="form-section">
                  <div className="section-header">
                    <h2 className="section-title">Marking Criteria</h2>
                    <p className="section-description">Configure how this task will be graded and evaluated</p>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="totalMarks">
                        Total Marks <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <FiAward className="input-icon" />
                        <input
                          type="number"
                          id="totalMarks"
                          name="totalMarks"
                          value={formData.markingCriteria?.totalMarks || 100}
                          onChange={(e) => handleTotalMarksChange(parseInt(e.target.value) || 0)}
                          min="1"
                          required
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="passingPercentage">
                        Passing Percentage <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <FiPercent className="input-icon" />
                        <input
                          type="number"
                          id="passingPercentage"
                          name="passingPercentage"
                          value={formData.markingCriteria?.passingPercentage || 40}
                          onChange={(e) => handlePassingPercentageChange(parseInt(e.target.value) || 0)}
                          min="0"
                          max="100"
                          required
                          placeholder="40"
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="passingMarks">
                      Passing Marks (Auto-calculated)
                    </label>
                    <div className="info-display">
                      <FiAward />
                      <span>
                        {formData.markingCriteria?.passingMarks || 40} out of {formData.markingCriteria?.totalMarks || 100} marks
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="markingScheme">
                      Marking Scheme
                    </label>
                    <select
                      id="markingScheme"
                      name="markingScheme"
                      value={formData.markingCriteria?.markingScheme || 'equal'}
                      onChange={(e) => handleMarkingCriteriaChange('markingScheme', e.target.value as 'equal' | 'weighted')}
                    >
                      <option value="equal">Equal Marks Per Question</option>
                      <option value="weighted">Weighted Marks (Different marks per question)</option>
                    </select>
                    <p className="field-hint">
                      {formData.markingCriteria?.markingScheme === 'equal' 
                        ? 'All questions will have equal marks' 
                        : 'You can assign different marks to each question'}
                    </p>
                  </div>

                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiMinus className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Enable Negative Marking</h3>
                          <p className="permission-description">
                            Deduct marks for incorrect answers
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.markingCriteria?.negativeMarking ? 'active' : ''}`}
                      onClick={() => handleMarkingCriteriaChange('negativeMarking', !formData.markingCriteria?.negativeMarking)}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>

                  {formData.markingCriteria?.negativeMarking && (
                    <div className="form-group">
                      <label htmlFor="negativeMarkingValue">
                        Negative Marking Value
                      </label>
                      <div className="input-with-icon">
                        <FiMinus className="input-icon" />
                        <input
                          type="number"
                          id="negativeMarkingValue"
                          name="negativeMarkingValue"
                          value={formData.markingCriteria?.negativeMarkingValue || 0.25}
                          onChange={(e) => handleMarkingCriteriaChange('negativeMarkingValue', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.25"
                          placeholder="0.25"
                        />
                      </div>
                      <p className="field-hint">
                        Marks deducted per wrong answer (e.g., 0.25 means 1/4 mark deducted)
                      </p>
                    </div>
                  )}

                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiCheck className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Auto-Grade</h3>
                          <p className="permission-description">
                            Automatically grade multiple choice and true/false questions
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.markingCriteria?.autoGrade ? 'active' : ''}`}
                      onClick={() => handleMarkingCriteriaChange('autoGrade', !formData.markingCriteria?.autoGrade)}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>
                </div>
              )}

              {/* Permissions & Settings */}
              <div className="form-section">
                <div className="section-header">
                  <h2 className="section-title">Permissions & Settings</h2>
                  <p className="section-description">Configure security and behavior settings</p>
                </div>
                <div className="permissions-list">
                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiLock className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Lock Screen</h3>
                          <p className="permission-description">
                            Prevent students from leaving the task screen once opened
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.permissions.lockScreen ? 'active' : ''}`}
                      onClick={() => handlePermissionToggle('lockScreen')}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>

                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiX className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Prevent Tab Switch</h3>
                          <p className="permission-description">
                            Warn students when they try to switch browser tabs
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.permissions.preventTabSwitch ? 'active' : ''}`}
                      onClick={() => handlePermissionToggle('preventTabSwitch')}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>

                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiX className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Prevent Copy/Paste</h3>
                          <p className="permission-description">
                            Disable copy and paste functionality during the task
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.permissions.preventCopyPaste ? 'active' : ''}`}
                      onClick={() => handlePermissionToggle('preventCopyPaste')}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>

                  <div className="permission-item">
                    <div className="permission-info">
                      <div className="permission-header">
                        <FiClock className="permission-icon" />
                        <div>
                          <h3 className="permission-title">Show Timer</h3>
                          <p className="permission-description">
                            Display a countdown timer to students
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${formData.permissions.showTimer ? 'active' : ''}`}
                      onClick={() => handlePermissionToggle('showTimer')}
                    >
                      <div className="toggle-slider" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onClick={handleContinueClick}
                >
                  Continue to Questions
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateTaskPage;

