import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks, type QuestionData, type QuestionType } from '../context/TasksContext';
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
  
  const [task, setTask] = useState(getTaskById(taskId || ''));
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(
    location.state?.studentInfo || null
  );
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

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

    setSubmittedAt(new Date().toISOString());
    setShowSubmissionModal(true);
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showSubmissionModal) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          if (task) {
            setSubmittedAt(new Date().toISOString());
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

  const currentQuestion = task.questions[currentQuestionIndex];
  const totalQuestions = task.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
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
      {/* Top Navigation Bar */}
      <motion.div
        className="main-task-navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="main-task-navbar-content">
          <button className="main-task-back-btn" onClick={handleGoBack}>
            <FiArrowLeft />
          </button>
          
          <div className="main-task-navbar-brand">
            <span className="main-brand-text">
              <span className="brand-r">R</span>aviro<span className="brand-dot">.</span>
            </span>
          </div>

          <div className="main-task-navbar-center">
            <div className="main-task-navbar-title">{task.name}</div>
            {studentInfo && (
              <div className="main-task-navbar-student">
                <FiUser />
                <span>{studentInfo.name}</span>
              </div>
            )}
          </div>

          <div className="main-task-navbar-right">
            {timeRemaining !== null && (
              <div className="main-task-timer-badge">
                <FiClock />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <div className="main-task-progress-badge">
              {currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="main-task-progress-track">
          <motion.div
            className="main-task-progress-indicator"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="main-task-wrapper">
        <div className="main-task-content">
          {currentQuestion ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                className="main-task-question-wrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Question Number & Type */}
                <div className="question-meta-header">
                  <div className="question-number-display">
                    <span className="question-current">{currentQuestionIndex + 1}</span>
                    <span className="question-separator">/</span>
                    <span className="question-total">{totalQuestions}</span>
                  </div>
                  <div className="question-type-indicator">
                    {getQuestionTypeIcon(currentQuestion.type)}
                    <span>{currentQuestion.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {currentQuestion.required && (
                      <span className="question-required-indicator">*</span>
                    )}
                  </div>
                </div>

                {/* Question Card */}
                <Card className="question-card-main" glass={true}>
                  <div className="question-content">
                    <h2 className="question-title-main">
                      {currentQuestion.title}
                    </h2>

                    {currentQuestion.description && (
                      <p className="question-description-main">
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

                {/* Navigation Footer */}
                <div className="question-navigation-footer">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<FiArrowLeft />}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>

                  <div className="question-navigation-info">
                    <span className="answered-count">{answeredCount} answered</span>
                  </div>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<FiCheck />}
                      onClick={handleSubmit}
                    >
                      Submit Task
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="main-task-no-questions">
              <p>No questions available.</p>
            </div>
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
