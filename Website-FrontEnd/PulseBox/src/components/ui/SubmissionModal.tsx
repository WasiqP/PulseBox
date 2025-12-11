import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiClock, FiFileText, FiX, FiAward } from 'react-icons/fi';
import type { TaskData, QuestionData } from '../../context/TasksContext';
import Button from './Button';
import './SubmissionModal.css';

interface StudentInfo {
  name: string;
  email: string;
}

interface Answer {
  questionId: string;
  value: string | string[] | number;
}

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskData;
  answers: Record<string, Answer>;
  studentInfo: StudentInfo | null;
  submittedAt: string;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  task,
  answers,
  studentInfo,
  submittedAt,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalQuestions = () => task.questions.length;
  const getAnsweredQuestions = () => {
    return Object.keys(answers).filter(
      key => {
        const answer = answers[key];
        if (Array.isArray(answer.value)) {
          return answer.value.length > 0;
        }
        return answer.value !== '' && answer.value !== null && answer.value !== undefined;
      }
    ).length;
  };

  const calculateScore = () => {
    if (!task.markingCriteria?.autoGrade) return null;

    let totalScore = 0;
    let maxScore = task.markingCriteria.totalMarks;

    task.questions.forEach((question: QuestionData) => {
      const answer = answers[question.id];
      if (!answer) return;

      const questionMarks = question.marks || (maxScore / task.questions.length);
      
      if (question.correctAnswers && question.correctAnswers.length > 0) {
        if (question.type === 'multipleChoice' || question.type === 'dropdown') {
          const selectedIndex = parseInt(answer.value as string);
          if (question.correctAnswers.includes(selectedIndex)) {
            totalScore += questionMarks;
          } else if (task.markingCriteria.negativeMarking) {
            totalScore -= task.markingCriteria.negativeMarkingValue;
          }
        } else if (question.type === 'checkbox') {
          const selectedIndices = (answer.value as string[]).map(v => parseInt(v));
          const correctIndices = question.correctAnswers;
          
          // Check if all correct answers are selected and no incorrect ones
          const allCorrect = correctIndices.every(idx => selectedIndices.includes(idx)) &&
                           selectedIndices.length === correctIndices.length;
          
          if (allCorrect) {
            totalScore += questionMarks;
          } else if (task.markingCriteria.negativeMarking) {
            totalScore -= task.markingCriteria.negativeMarkingValue;
          }
        }
      }
    });

    return Math.max(0, totalScore); // Ensure score doesn't go negative
  };

  const score = calculateScore();
  const totalQuestions = getTotalQuestions();
  const answeredQuestions = getAnsweredQuestions();
  const percentage = score !== null && task.markingCriteria
    ? (score / task.markingCriteria.totalMarks) * 100
    : null;
  const passed = score !== null && task.markingCriteria
    ? score >= task.markingCriteria.passingMarks
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="submission-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="submission-modal-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="submission-modal-card">
                {/* Success Icon */}
                <div className="submission-success-icon">
                  <FiCheck />
                </div>

                {/* Header */}
                <div className="submission-modal-header">
                  <h2 className="submission-modal-title">Task Submitted Successfully!</h2>
                  <button className="submission-modal-close" onClick={onClose}>
                    <FiX />
                  </button>
                </div>

                {/* Content */}
                <div className="submission-modal-content">
                  <p className="submission-success-message">
                    Thank you for completing the task. Your submission has been recorded.
                  </p>

                  {/* Submission Details */}
                  <div className="submission-details">
                    <div className="submission-detail-item">
                      <FiFileText />
                      <div>
                        <span className="detail-label">Task</span>
                        <span className="detail-value">{task.name}</span>
                      </div>
                    </div>

                    {studentInfo && (
                      <div className="submission-detail-item">
                        <FiFileText />
                        <div>
                          <span className="detail-label">Submitted By</span>
                          <span className="detail-value">
                            {studentInfo.name} ({studentInfo.email})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="submission-detail-item">
                      <FiClock />
                      <div>
                        <span className="detail-label">Submitted At</span>
                        <span className="detail-value">{formatDate(submittedAt)}</span>
                      </div>
                    </div>

                    <div className="submission-detail-item">
                      <FiFileText />
                      <div>
                        <span className="detail-label">Questions Answered</span>
                        <span className="detail-value">
                          {answeredQuestions} of {totalQuestions}
                        </span>
                      </div>
                    </div>

                    {score !== null && task.markingCriteria && (
                      <>
                        <div className="submission-detail-item">
                          <FiAward />
                          <div>
                            <span className="detail-label">Score</span>
                            <span className="detail-value">
                              {score.toFixed(2)} / {task.markingCriteria.totalMarks} marks
                            </span>
                          </div>
                        </div>

                        {percentage !== null && (
                          <div className="submission-detail-item">
                            <FiAward />
                            <div>
                              <span className="detail-label">Percentage</span>
                              <span className="detail-value">{percentage.toFixed(2)}%</span>
                            </div>
                          </div>
                        )}

                        {passed !== null && (
                          <div className={`submission-status-badge ${passed ? 'passed' : 'failed'}`}>
                            <FiCheck />
                            <span>{passed ? 'Passed' : 'Failed'}</span>
                            <span className="status-note">
                              (Required: {task.markingCriteria.passingPercentage}%)
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {score === null && (
                    <div className="submission-note">
                      <p>
                        Your responses have been submitted. The task will be reviewed and graded manually.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="submission-modal-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onClose}
                    fullWidth
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubmissionModal;
