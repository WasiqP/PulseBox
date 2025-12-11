import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks, type QuestionData, type QuestionType } from '../context/TasksContext';
import { useResponses } from '../context/ResponsesContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SubmissionModal from '../components/ui/SubmissionModal';
import {
  FiFileText,
  FiClock,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiType,
  FiAlignLeft,
  FiList,
  FiCheckSquare,
  FiChevronDown,
  FiUser,
} from 'react-icons/fi';
import './MainTask.css';

interface StudentInfo {
  name: string;
  email: string;
}

interface Answer {
  questionId: string;
  value: string | string[] | number;
}

const MainTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getTaskById } = useTasks();
  const { addResponse } = useResponses();
  
  const [task, setTask] = useState(getTaskById(taskId || ''));
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(
    location.state?.studentInfo || null
  );
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const taskData = getTaskById(taskId || '');
    if (!taskData) {
      navigate('/');
      return;
    }
    setTask(taskData);

    // Initialize timer if enabled
    if (taskData.permissions.showTimer && taskData.expectedTime) {
      const totalSeconds = taskData.timeUnit === 'hours' 
        ? taskData.expectedTime * 3600 
        : taskData.expectedTime * 60;
      setTimeRemaining(totalSeconds);
    }
  }, [taskId, getTaskById, navigate]);

  const calculateScore = (taskData: typeof task, answersData: Record<string, Answer>) => {
    if (!taskData?.markingCriteria?.autoGrade) return null;

    let totalScore = 0;
    let maxScore = taskData.markingCriteria.totalMarks;

    taskData.questions.forEach((question: QuestionData) => {
      const answer = answersData[question.id];
      if (!answer) return;

      const questionMarks = question.marks || (maxScore / taskData.questions.length);
      
      if (question.correctAnswers && question.correctAnswers.length > 0) {
        if (question.type === 'multipleChoice' || question.type === 'dropdown') {
          const selectedIndex = parseInt(answer.value as string);
          if (question.correctAnswers.includes(selectedIndex)) {
            totalScore += questionMarks;
          } else if (taskData.markingCriteria.negativeMarking) {
            totalScore -= taskData.markingCriteria.negativeMarkingValue;
          }
        } else if (question.type === 'checkbox') {
          const selectedIndices = (answer.value as string[]).map(v => parseInt(v));
          const correctIndices = question.correctAnswers;
          
          const allCorrect = correctIndices.every(idx => selectedIndices.includes(idx)) &&
                           selectedIndices.length === correctIndices.length;
          
          if (allCorrect) {
            totalScore += questionMarks;
          } else if (taskData.markingCriteria.negativeMarking) {
            totalScore -= taskData.markingCriteria.negativeMarkingValue;
          }
        }
      }
    });

    return Math.max(0, totalScore);
  };

  const handleSubmit = () => {
    if (!task) return;

    // Check required questions
    const requiredQuestions = task.questions.filter(q => q.required);
    const unansweredRequired = requiredQuestions.filter(
      q => !answers[q.id] || 
      (Array.isArray(answers[q.id]?.value) && answers[q.id]?.value.length === 0) ||
      (!Array.isArray(answers[q.id]?.value) && !answers[q.id]?.value)
    );

    if (unansweredRequired.length > 0) {
      const questionNumbers = unansweredRequired.map((q, idx) => 
        task.questions.findIndex(tq => tq.id === q.id) + 1
      ).join(', ');
      alert(`Please answer all required questions. Missing: Question ${questionNumbers}`);
      return;
    }

    const submittedAtTime = new Date().toISOString();
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Calculate score if auto-grading is enabled
    const score = calculateScore(task, answers);
    const percentage = score !== null && task.markingCriteria
      ? (score / task.markingCriteria.totalMarks) * 100
      : undefined;
    const passed = score !== null && task.markingCriteria
      ? score >= task.markingCriteria.passingMarks
      : undefined;

    // Save response
    addResponse({
      taskId: task.id,
      taskName: task.name,
      taskType: task.taskType,
      classId: task.classId,
      studentInfo,
      answers,
      submittedAt: submittedAtTime,
      timeSpent,
      score,
      percentage,
      passed,
      isGraded: score !== undefined,
    });

    setSubmittedAt(submittedAtTime);
    setShowSubmissionModal(true);
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showSubmissionModal) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          if (task) {
            const submittedAtTime = new Date().toISOString();
            const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
            
            const score = calculateScore(task, answers);
            const percentage = score !== null && task.markingCriteria
              ? (score / task.markingCriteria.totalMarks) * 100
              : undefined;
            const passed = score !== null && task.markingCriteria
              ? score >= task.markingCriteria.passingMarks
              : undefined;

            addResponse({
              taskId: task.id,
              taskName: task.name,
              taskType: task.taskType,
              classId: task.classId,
              studentInfo,
              answers,
              submittedAt: submittedAtTime,
              timeSpent,
              score,
              percentage,
              passed,
              isGraded: score !== undefined,
            });

            setSubmittedAt(submittedAtTime);
            setShowSubmissionModal(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showSubmissionModal, task]);

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'shortText':
        return <FiType />;
      case 'longText':
        return <FiAlignLeft />;
      case 'multipleChoice':
        return <FiList />;
      case 'checkbox':
        return <FiCheckSquare />;
      case 'dropdown':
        return <FiChevronDown />;
      default:
        return <FiFileText />;
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, value }
    }));
  };

  const handleMultipleChoiceChange = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, value: optionIndex.toString() }
    }));
  };

  const handleCheckboxChange = (questionId: string, optionIndex: number) => {
    setAnswers(prev => {
      const current = prev[questionId]?.value as string[] || [];
      const newValue = current.includes(optionIndex.toString())
        ? current.filter(v => v !== optionIndex.toString())
        : [...current, optionIndex.toString()];
      
      return {
        ...prev,
        [questionId]: { questionId, value: newValue }
      };
    });
  };

  const handleGoBack = () => {
    if (window.confirm('Are you sure you want to leave? Your progress will be lost.')) {
      navigate(-1);
    }
  };

  if (!task) {
    return (
      <div className="main-task-container">
        <div className="main-task-error">
          <h1>Task Not Found</h1>
          <p>The task you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const displayMode = task.displayMode || 'single'; // Default to 'single' if not set
  const currentQuestion = task.questions[currentQuestionIndex];
  const totalQuestions = task.questions.length;
  const progress = displayMode === 'form' 
    ? (Object.keys(answers).filter(key => {
        const answer = answers[key];
        if (Array.isArray(answer.value)) {
          return answer.value.length > 0;
        }
        return answer.value !== '' && answer.value !== null && answer.value !== undefined;
      }).length / totalQuestions) * 100
    : ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).filter(
    key => {
      const answer = answers[key];
      if (Array.isArray(answer.value)) {
        return answer.value.length > 0;
      }
      return answer.value !== '' && answer.value !== null && answer.value !== undefined;
    }
  ).length;

  return (
    <div className="main-task-container">
      {/* Compact Top Bar */}
      <motion.div
        className="main-task-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="main-task-header-content">
          <button className="main-task-back-btn" onClick={handleGoBack} title="Go back">
            <FiArrowLeft />
          </button>
          
          <div className="main-task-header-info">
            <div className="main-task-title-group">
              <span className="main-task-brand">Raviro.</span>
              <span className="main-task-separator">•</span>
              <span className="main-task-subject">{task.name}</span>
            </div>
            {studentInfo && (
              <div className="main-task-student-info">
                <FiUser />
                <span>{studentInfo.name}</span>
              </div>
            )}
          </div>

          <div className="main-task-header-stats">
            {timeRemaining !== null && (
              <div className="main-task-timer" title="Time remaining">
                <FiClock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <div className="main-task-progress-circle">
              <svg className="progress-ring" viewBox="0 0 36 36">
                <circle className="progress-ring-background" cx="18" cy="18" r="16" />
                <motion.circle
                  className="progress-ring-progress"
                  cx="18"
                  cy="18"
                  r="16"
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${progress} 100` }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="progress-text">
                {displayMode === 'form' ? answeredCount : currentQuestionIndex + 1}
                <span>/{totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="main-task-body">
        <div className="main-task-content-wrapper">
          {displayMode === 'form' ? (
            /* Form View - Show All Questions */
            <div className="main-task-form-view">
              <div className="form-view-header">
                <h2 className="form-view-title">Answer all questions below</h2>
                <p className="form-view-subtitle">{answeredCount} of {totalQuestions} questions answered</p>
              </div>

              <div className="form-questions-list">
                {task.questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="form-question-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="form-question-card" glass={true}>
                      <div className="form-question-header">
                        <div className="form-question-number">
                          <span>{index + 1}</span>
                        </div>
                        <div className="form-question-type-badge">
                          {getQuestionTypeIcon(question.type)}
                          <span>{question.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                          {question.required && (
                            <span className="question-required-indicator">*</span>
                          )}
                        </div>
                      </div>

                      <div className="form-question-content">
                        <h3 className="form-question-title">{question.title}</h3>
                        {question.description && (
                          <p className="form-question-description">{question.description}</p>
                        )}

                        {/* Answer Input Section */}
                        <div className="form-answer-section">
                          {question.type === 'shortText' && (
                            <input
                              type="text"
                              className="form-answer-input"
                              placeholder={question.placeholder || 'Type your answer here...'}
                              value={(answers[question.id]?.value as string) || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              maxLength={question.maxLength}
                            />
                          )}

                          {question.type === 'longText' && (
                            <textarea
                              className="form-answer-textarea"
                              placeholder={question.placeholder || 'Write your answer here...'}
                              value={(answers[question.id]?.value as string) || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              maxLength={question.maxLength}
                              rows={6}
                            />
                          )}

                          {question.type === 'multipleChoice' && question.options && (
                            <div className="form-answer-options">
                              {question.options.map((option, optIndex) => (
                                <motion.label
                                  key={optIndex}
                                  className={`form-option-item ${(answers[question.id]?.value as string) === optIndex.toString() ? 'selected' : ''}`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <input
                                    type="radio"
                                    name={`form-question-${question.id}`}
                                    value={optIndex}
                                    checked={(answers[question.id]?.value as string) === optIndex.toString()}
                                    onChange={() => handleMultipleChoiceChange(question.id, optIndex)}
                                    className="form-option-radio"
                                  />
                                  <span className="form-option-content">
                                    <span className="form-option-letter">{String.fromCharCode(65 + optIndex)}</span>
                                    <span className="form-option-text">{option}</span>
                                  </span>
                                </motion.label>
                              ))}
                            </div>
                          )}

                          {question.type === 'checkbox' && question.options && (
                            <div className="form-answer-options">
                              {question.options.map((option, optIndex) => {
                                const selectedValues = (answers[question.id]?.value as string[]) || [];
                                const isSelected = selectedValues.includes(optIndex.toString());
                                return (
                                  <motion.label
                                    key={optIndex}
                                    className={`form-option-item checkbox ${isSelected ? 'selected' : ''}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <input
                                      type="checkbox"
                                      value={optIndex}
                                      checked={isSelected}
                                      onChange={() => handleCheckboxChange(question.id, optIndex)}
                                      className="form-option-checkbox"
                                    />
                                    <span className="form-option-content">
                                      <span className="form-option-letter">{String.fromCharCode(65 + optIndex)}</span>
                                      <span className="form-option-text">{option}</span>
                                    </span>
                                  </motion.label>
                                );
                              })}
                            </div>
                          )}

                          {question.type === 'dropdown' && question.options && (
                            <select
                              className="form-answer-select"
                              value={(answers[question.id]?.value as string) || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            >
                              <option value="">Select an option...</option>
                              {question.options.map((option, optIndex) => (
                                <option key={optIndex} value={optIndex.toString()}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="form-submit-section">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<FiCheck />}
                  onClick={handleSubmit}
                  fullWidth
                  style={{ padding: '1.25rem 2rem', fontSize: '1.1rem' }}
                >
                  Submit Task
                </Button>
                <p className="form-submit-hint">
                  Make sure you've answered all required questions before submitting
                </p>
              </div>
            </div>
          ) : (
            /* Single View - One Question at a Time */
            currentQuestion ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  className="main-task-question-wrapper"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Question Header */}
                  <div className="question-header-section">
                    <div className="question-number-badge">
                      <span className="question-num-current">{currentQuestionIndex + 1}</span>
                      <span className="question-num-total">/{totalQuestions}</span>
                    </div>
                    <div className="question-type-tag">
                      {getQuestionTypeIcon(currentQuestion.type)}
                      <span>{currentQuestion.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {currentQuestion.required && <span className="required-star">*</span>}
                    </div>
                  </div>

                  {/* Question Card */}
                  <Card className="question-card-enhanced" glass={true}>
                    <div className="question-content-enhanced">
                      <h2 className="question-title-enhanced">
                        {currentQuestion.title}
                      </h2>

                      {currentQuestion.description && (
                        <p className="question-description-enhanced">
                          {currentQuestion.description}
                        </p>
                      )}

                      {/* Answer Input Section */}
                      <div className="answer-section-main">
                        {currentQuestion.type === 'shortText' && (
                          <input
                            type="text"
                            className="answer-input-main"
                            placeholder={currentQuestion.placeholder || 'Type your answer here...'}
                            value={(answers[currentQuestion.id]?.value as string) || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            maxLength={currentQuestion.maxLength}
                          />
                        )}

                        {currentQuestion.type === 'longText' && (
                          <textarea
                            className="answer-textarea-main"
                            placeholder={currentQuestion.placeholder || 'Write your answer here...'}
                            value={(answers[currentQuestion.id]?.value as string) || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            maxLength={currentQuestion.maxLength}
                            rows={8}
                          />
                        )}

                        {currentQuestion.type === 'multipleChoice' && currentQuestion.options && (
                          <div className="answer-options-main">
                            {currentQuestion.options.map((option, index) => (
                              <motion.label
                                key={index}
                                className={`option-item-main ${(answers[currentQuestion.id]?.value as string) === index.toString() ? 'selected' : ''}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <input
                                  type="radio"
                                  name={`question-${currentQuestion.id}`}
                                  value={index}
                                  checked={(answers[currentQuestion.id]?.value as string) === index.toString()}
                                  onChange={() => handleMultipleChoiceChange(currentQuestion.id, index)}
                                  className="option-radio"
                                />
                                <span className="option-content">
                                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                  <span className="option-text-main">{option}</span>
                                </span>
                              </motion.label>
                            ))}
                          </div>
                        )}

                        {currentQuestion.type === 'checkbox' && currentQuestion.options && (
                          <div className="answer-options-main">
                            {currentQuestion.options.map((option, index) => {
                              const selectedValues = (answers[currentQuestion.id]?.value as string[]) || [];
                              const isSelected = selectedValues.includes(index.toString());
                              return (
                                <motion.label
                                  key={index}
                                  className={`option-item-main checkbox ${isSelected ? 'selected' : ''}`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <input
                                    type="checkbox"
                                    value={index}
                                    checked={isSelected}
                                    onChange={() => handleCheckboxChange(currentQuestion.id, index)}
                                    className="option-checkbox"
                                  />
                                  <span className="option-content">
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    <span className="option-text-main">{option}</span>
                                  </span>
                                </motion.label>
                              );
                            })}
                          </div>
                        )}

                        {currentQuestion.type === 'dropdown' && currentQuestion.options && (
                          <select
                            className="answer-select-main"
                            value={(answers[currentQuestion.id]?.value as string) || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          >
                            <option value="">Select an option...</option>
                            {currentQuestion.options.map((option, index) => (
                              <option key={index} value={index.toString()}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Enhanced Navigation */}
                  <div className="question-navigation-enhanced">
                    <button
                      className="nav-btn nav-btn-prev"
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <FiArrowLeft />
                      <span>Previous</span>
                    </button>

                    <div className="navigation-progress-info">
                      <div className="answered-indicator">
                        <span className="answered-count">{answeredCount}</span>
                        <span className="answered-label">answered</span>
                      </div>
                    </div>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        className="nav-btn nav-btn-next"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      >
                        <span>Next</span>
                        <FiArrowRight />
                      </button>
                    ) : (
                      <button
                        className="nav-btn nav-btn-submit"
                        onClick={handleSubmit}
                      >
                        <FiCheck />
                        <span>Submit</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="main-task-no-questions">
                <p>No questions available.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && task && (
        <SubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false);
            navigate(`/task/${taskId}`);
          }}
          task={task}
          answers={answers}
          studentInfo={studentInfo}
          submittedAt={submittedAt || new Date().toISOString()}
        />
      )}
    </div>
  );
};

export default MainTask;
