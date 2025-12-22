import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useResponses } from '../context/ResponsesContext';
import { useTasks } from '../context/TasksContext';
import { useClasses } from '../context/ClassesContext';
import { useAlert } from '../context/AlertModalContext';
import {
  FiArrowLeft,
  FiSave,
  FiCheck,
  FiX,
  FiUser,
  FiClock,
  FiAward,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import './GradeResponsePage.css';

const GradeResponsePage: React.FC = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const { getResponseById, updateResponse } = useResponses();
  const { getTaskById } = useTasks();
  const { getClassById } = useClasses();
  const { showAlert } = useAlert();

  const response = responseId ? getResponseById(responseId) : null;
  const task = response ? getTaskById(response.taskId) : null;
  const classData = response ? getClassById(response.classId) : null;

  const [score, setScore] = useState<number | undefined>(response?.score);
  const [feedback, setFeedback] = useState<string>(response?.feedback || '');
  const [questionScores, setQuestionScores] = useState<Record<string, number>>(() => {
    // Initialize question scores if task has marking criteria
    const initial: Record<string, number> = {};
    if (task?.questions) {
      task.questions.forEach((q) => {
        // If question has marks, initialize with 0 or existing partial score
        if (q.marks) {
          initial[q.id] = 0;
        }
      });
    }
    return initial;
  });
  const [isSaving, setIsSaving] = useState(false);

  const maxScore = task?.markingCriteria?.totalMarks || 100;
  const calculatedPercentage = score !== undefined ? (score / maxScore) * 100 : undefined;
  const passingScore = task?.markingCriteria?.passingScore || (maxScore * 0.6);
  const isPassing = score !== undefined ? score >= passingScore : undefined;

  const handleSave = async () => {
    if (score === undefined) {
      showAlert({
        title: 'Score Required',
        message: 'Please enter a score before saving.',
        buttonText: 'OK'
      });
      return;
    }

    if (score < 0 || score > maxScore) {
      showAlert({
        title: 'Invalid Score',
        message: `Score must be between 0 and ${maxScore}.`,
        buttonText: 'OK'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Calculate percentage and passed status
      const percentage = (score / maxScore) * 100;
      const passed = score >= passingScore;

      // Update response
      if (responseId) {
        updateResponse(responseId, {
          score,
          percentage,
          passed,
          feedback: feedback.trim() || undefined,
          isGraded: true,
        });
      }

      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        showAlert({
          title: 'Success',
          message: 'Response graded successfully!',
          buttonText: 'OK'
        });
        navigate('/app/responses');
      }, 500);
    } catch (error) {
      console.error('Error saving grade:', error);
      setIsSaving(false);
      showAlert({
        title: 'Error',
        message: 'Failed to save grade. Please try again.',
        buttonText: 'OK'
      });
    }
  };

  const getQuestionMarks = (questionId: string) => {
    return task?.questions.find(q => q.id === questionId)?.marks || 0;
  };

  const getTotalQuestionMarks = () => {
    return task?.questions.reduce((sum, q) => sum + (q.marks || 0), 0) || 0;
  };

  const updateQuestionScore = (questionId: string, value: number) => {
    const maxMarks = getQuestionMarks(questionId);
    const clampedValue = Math.max(0, Math.min(value, maxMarks));
    setQuestionScores(prev => ({ ...prev, [questionId]: clampedValue }));
    
    // Auto-calculate total score if all questions have marks
    if (task?.markingCriteria?.autoGrade && task.questions.every(q => q.marks)) {
      const total = task.questions.reduce((sum, q) => {
        const qScore = q.id === questionId ? clampedValue : (questionScores[q.id] || 0);
        return sum + qScore;
      }, 0);
      setScore(total);
    }
  };

  if (!response || !task) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <Card className="error-card" glass={true}>
            <FiAlertCircle className="error-icon" />
            <h2>Response Not Found</h2>
            <p>The response you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/app/responses')}>
              Back to Responses
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="grade-response-header">
          <button className="back-button" onClick={() => navigate('/app/responses')}>
            <FiArrowLeft />
            <span>Back to Responses</span>
          </button>
          <div className="header-info">
            <h1 className="page-title">Grade Response</h1>
            <p className="page-subtitle">{task.name}</p>
          </div>
        </div>

        <div className="grade-response-content">
          {/* Student Info Card */}
          <Card className="student-info-card" glass={true}>
            <div className="student-info-header">
              <div className="student-avatar">
                <FiUser />
              </div>
              <div className="student-details">
                {response.studentInfo ? (
                  <>
                    <h3 className="student-name">{response.studentInfo.name}</h3>
                    <p className="student-email">{response.studentInfo.email}</p>
                  </>
                ) : (
                  <>
                    <h3 className="student-name">Public Response</h3>
                    <p className="student-email">No student information available</p>
                  </>
                )}
                {classData && (
                  <span className="class-badge">{classData.name}</span>
                )}
              </div>
            </div>
            <div className="submission-info">
              <div className="info-item">
                <FiClock />
                <span>Submitted: {new Date(response.submittedAt).toLocaleString()}</span>
              </div>
              {response.timeSpent && (
                <div className="info-item">
                  <FiClock />
                  <span>Time Spent: {Math.floor(response.timeSpent / 60)}m {response.timeSpent % 60}s</span>
                </div>
              )}
              {response.isGraded && (
                <div className="info-item">
                  <FiCheckCircle />
                  <span>Status: {response.passed ? 'Passed' : 'Failed'}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Answers Section */}
          <Card className="answers-section" glass={true}>
            <h2 className="section-title">Student Answers</h2>
            <div className="answers-list">
              {task.questions.map((question, index) => {
                const answer = response.answers[question.id];
                const hasAnswer = answer && (
                  Array.isArray(answer.value) ? answer.value.length > 0 : answer.value !== ''
                );
                const questionMarks = question.marks || 0;
                const questionScore = questionScores[question.id] || 0;
                const isCorrect = task.markingCriteria?.autoGrade && 
                  question.correctAnswers && 
                  question.correctAnswers.length > 0 &&
                  (() => {
                    if (question.type === 'multipleChoice' || question.type === 'dropdown') {
                      return question.correctAnswers.includes(parseInt(answer?.value as string));
                    }
                    if (question.type === 'checkbox') {
                      const selected = (answer?.value as string[])?.map(v => parseInt(v)) || [];
                      return question.correctAnswers.every(idx => selected.includes(idx)) &&
                             selected.length === question.correctAnswers.length;
                    }
                    return false;
                  })();

                return (
                  <div key={question.id} className="answer-item">
                    <div className="answer-header">
                      <div className="question-info">
                        <span className="question-number">Question {index + 1}</span>
                        <span className="question-type">{question.type}</span>
                        {questionMarks > 0 && (
                          <span className="question-marks">({questionMarks} marks)</span>
                        )}
                      </div>
                      {task.markingCriteria?.autoGrade && question.correctAnswers && (
                        <div className={`correctness-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? <FiCheck /> : <FiX />}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      )}
                    </div>
                    <div className="question-title">{question.title}</div>
                    {hasAnswer ? (
                      <div className="answer-content">
                        {question.type === 'multipleChoice' && question.options && (
                          <div className="answer-value">
                            <strong>Answer:</strong> {question.options[parseInt(answer.value as string)]}
                          </div>
                        )}
                        {question.type === 'checkbox' && question.options && (
                          <div className="answer-value">
                            <strong>Answer:</strong> {(answer.value as string[]).map(idx => 
                              question.options?.[parseInt(idx)]
                            ).filter(Boolean).join(', ')}
                          </div>
                        )}
                        {question.type === 'dropdown' && question.options && (
                          <div className="answer-value">
                            <strong>Answer:</strong> {question.options[parseInt(answer.value as string)]}
                          </div>
                        )}
                        {(question.type === 'shortText' || question.type === 'longText') && (
                          <div className="answer-value">
                            <strong>Answer:</strong>
                            <div className="text-answer">{answer.value as string}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="answer-empty">No answer provided</div>
                    )}
                    {questionMarks > 0 && (
                      <div className="question-scoring">
                        <label className="score-label">
                          Score for this question:
                          <input
                            type="number"
                            min="0"
                            max={questionMarks}
                            value={questionScore}
                            onChange={(e) => updateQuestionScore(question.id, parseFloat(e.target.value) || 0)}
                            className="score-input"
                          />
                          <span className="score-max">/ {questionMarks}</span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Grading Panel */}
          <Card className="grading-panel" glass={true}>
            <h2 className="section-title">Grading</h2>
            <div className="grading-form">
              <div className="score-input-group">
                <label htmlFor="score">
                  Total Score
                  <span className="required">*</span>
                </label>
                <div className="score-input-wrapper">
                  <input
                    id="score"
                    type="number"
                    min="0"
                    max={maxScore}
                    step="0.1"
                    value={score ?? ''}
                    onChange={(e) => setScore(parseFloat(e.target.value) || undefined)}
                    className="score-input-large"
                    placeholder="0"
                  />
                  <span className="score-max-large">/ {maxScore}</span>
                </div>
                {calculatedPercentage !== undefined && (
                  <div className="percentage-display">
                    Percentage: <strong>{calculatedPercentage.toFixed(1)}%</strong>
                    {isPassing !== undefined && (
                      <span className={`pass-status ${isPassing ? 'passed' : 'failed'}`}>
                        {isPassing ? <FiCheck /> : <FiX />}
                        {isPassing ? 'Passed' : 'Failed'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="feedback-input-group">
                <label htmlFor="feedback">Feedback (Optional)</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="feedback-textarea"
                  placeholder="Add feedback for the student..."
                  rows={6}
                />
              </div>

              <div className="grading-actions">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/app/responses')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving || score === undefined}
                  leftIcon={isSaving ? undefined : <FiSave />}
                >
                  {isSaving ? 'Saving...' : 'Save Grade'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GradeResponsePage;

