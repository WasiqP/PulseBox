import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTasks, type QuestionData, type QuestionType } from '../context/TasksContext';
import { useConfirm } from '../context/ConfirmModalContext';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMenu,
  FiX,
  FiCheck,
  FiType,
  FiList,
  FiCheckSquare,
  FiChevronDown,
  FiFileText,
  FiAlignLeft,
  FiCopy,
} from 'react-icons/fi';
import './DashboardPage.css';

const QUESTION_TYPES: { id: QuestionType; label: string; icon: React.ReactNode }[] = [
  { id: 'shortText', label: 'Single Line Answer', icon: <FiType /> },
  { id: 'longText', label: 'Long Text Answer', icon: <FiAlignLeft /> },
  { id: 'multipleChoice', label: 'Multiple Choice', icon: <FiList /> },
  { id: 'checkbox', label: 'Checkboxes', icon: <FiCheckSquare /> },
  { id: 'dropdown', label: 'Dropdown', icon: <FiChevronDown /> },
];

const getQuestionTypeLabel = (type: QuestionType) => {
  return QUESTION_TYPES.find(t => t.id === type)?.label || type;
};

const getQuestionTypeIcon = (type: QuestionType) => {
  return QUESTION_TYPES.find(t => t.id === type)?.icon || <FiFileText />;
};

interface QuestionItemProps {
  question: QuestionData;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  showMarks: boolean;
  onMarksChange: (marks: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  showMarks,
  onMarksChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="question-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
      <div className="question-item-content">
        <div className="question-drag-handle" {...attributes} {...listeners}>
          <FiMenu />
        </div>
        <div className="question-number">{index + 1}</div>
        <div className="question-main">
          <div className="question-header">
            <h3 className="question-title">{question.title || 'Untitled Question'}</h3>
            <div className="question-type-badge">
              {getQuestionTypeIcon(question.type)}
              <span>{getQuestionTypeLabel(question.type)}</span>
            </div>
          </div>
          <div className="question-meta">
            {question.options && question.options.length > 0 && (
              <span className="question-meta-item">
                {question.options.length} {question.options.length === 1 ? 'option' : 'options'}
              </span>
            )}
            {question.required && (
              <span className="question-required-badge">Required</span>
            )}
            {question.maxLength && (
              <span className="question-meta-item">
                Max {question.maxLength} characters
              </span>
            )}
          </div>
        </div>
        {showMarks && (
          <div className="question-marks-input">
            <label>Marks</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={question.marks || 0}
              onChange={(e) => onMarksChange(parseFloat(e.target.value) || 0)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <div className="question-actions">
          <button
            className="question-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate question"
          >
            <FiCopy />
          </button>
          <button
            className="question-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit question"
          >
            <FiEdit />
          </button>
          <button
            className="question-action-btn question-action-btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete question"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface EditQuestionModalProps {
  question: QuestionData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: QuestionData) => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<QuestionData>({
    id: '',
    title: '',
    type: 'shortText',
    required: true,
    placeholder: '',
    description: '',
    maxLength: undefined,
    options: [],
    correctAnswers: [],
    marks: 0,
  });
  const [newOption, setNewOption] = useState('');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        id: '',
        title: '',
        type: 'shortText',
        required: true,
        placeholder: '',
        description: '',
        maxLength: undefined,
        options: [],
        correctAnswers: [],
        marks: 0,
      });
    }
    setNewOption('');
  }, [question, isOpen]);

  const needsOptions = ['multipleChoice', 'checkbox', 'dropdown'].includes(formData.type);
  const needsPlaceholder = ['shortText', 'longText'].includes(formData.type);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()],
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => {
      const newOptions = prev.options?.filter((_, i) => i !== index) || [];
      const newCorrectAnswers = (prev.correctAnswers || [])
        .filter(correctIndex => correctIndex !== index)
        .map(correctIndex => correctIndex > index ? correctIndex - 1 : correctIndex);
      return {
        ...prev,
        options: newOptions,
        correctAnswers: newCorrectAnswers,
      };
    });
  };

  const handleToggleCorrectAnswer = (index: number) => {
    setFormData(prev => {
      const currentCorrectAnswers = prev.correctAnswers || [];
      const isCurrentlyCorrect = currentCorrectAnswers.includes(index);
      
      if (prev.type === 'dropdown') {
        return {
          ...prev,
          correctAnswers: isCurrentlyCorrect ? [] : [index],
        };
      } else {
        if (isCurrentlyCorrect) {
          return {
            ...prev,
            correctAnswers: currentCorrectAnswers.filter(i => i !== index),
          };
        } else {
          return {
            ...prev,
            correctAnswers: [...currentCorrectAnswers, index],
          };
        }
      }
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a question title');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleTypeChange = (type: QuestionType) => {
    const wasOptionType = ['multipleChoice', 'checkbox', 'dropdown'].includes(formData.type);
    const isOptionType = ['multipleChoice', 'checkbox', 'dropdown'].includes(type);
    
    setFormData(prev => ({
      ...prev,
      type,
      options: isOptionType && !wasOptionType ? [] : prev.options,
      correctAnswers: isOptionType && !wasOptionType ? [] : prev.correctAnswers,
    }));
    setShowTypeSelector(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content edit-question-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{question ? 'Edit Question' : 'Add Question'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="questionTitle">
              Question Title <span className="required">*</span>
            </label>
            <textarea
              id="questionTitle"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your question..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Question Type</label>
            <div className="question-type-selector-wrapper">
              <button
                type="button"
                className="question-type-selector-btn"
                onClick={() => setShowTypeSelector(!showTypeSelector)}
              >
                {getQuestionTypeIcon(formData.type)}
                <span>{getQuestionTypeLabel(formData.type)}</span>
                <FiChevronDown />
              </button>
              {showTypeSelector && (
                <div className="question-type-dropdown">
                  {QUESTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`question-type-option ${formData.type === type.id ? 'selected' : ''}`}
                      onClick={() => handleTypeChange(type.id)}
                    >
                      {type.icon}
                      <span>{type.label}</span>
                      {formData.type === type.id && <FiCheck />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {needsPlaceholder && (
            <div className="form-group">
              <label htmlFor="placeholder">Placeholder Text (Optional)</label>
              <input
                type="text"
                id="placeholder"
                value={formData.placeholder || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="Enter placeholder text..."
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a helpful description or hint..."
              rows={2}
            />
          </div>

          {needsOptions && (
            <div className="form-group">
              <label>Options</label>
              <p className="field-hint">
                {formData.type === 'dropdown'
                  ? 'Tap ✓ to mark the correct answer'
                  : 'Tap ✓ to mark correct answers (multiple allowed)'}
              </p>
              {formData.options?.map((option, index) => {
                const isCorrect = formData.correctAnswers?.includes(index) || false;
                return (
                  <div key={index} className={`option-row ${isCorrect ? 'option-row-correct' : ''}`}>
                    <button
                      type="button"
                      className="correct-answer-btn"
                      onClick={() => handleToggleCorrectAnswer(index)}
                    >
                      <div className={`correct-answer-checkbox ${isCorrect ? 'checked' : ''}`}>
                        {isCorrect && <FiCheck />}
                      </div>
                    </button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(formData.options || [])];
                        newOptions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-option-btn"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                );
              })}
              <div className="add-option-row">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                  placeholder="Add option..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {(formData.type === 'shortText' || formData.type === 'longText') && (
            <div className="form-group">
              <label htmlFor="maxLength">Character Limit (Optional)</label>
              <input
                type="number"
                id="maxLength"
                min="1"
                value={formData.maxLength || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                }))}
                placeholder="e.g., 500"
              />
            </div>
          )}

          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
              />
              <span>Required</span>
            </label>
            <p className="field-hint">User must answer this question</p>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Question
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TrashZone: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { setNodeRef } = useDroppable({
    id: 'trash',
  });

  return (
    <div
      ref={setNodeRef}
      className={`trash-zone ${isActive ? 'active' : ''}`}
    >
      <FiTrash2 />
      <span>Drop here to delete</span>
    </div>
  );
};

const QuestionsScreen: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById, addQuestion, updateQuestion, deleteQuestion, reorderQuestions } = useTasks();
  const { confirm } = useConfirm();
  
  // Memoize task lookup to avoid unnecessary re-renders
  const task = useMemo(() => {
    return taskId ? getTaskById(taskId) : null;
  }, [taskId, getTaskById]);
  
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingToTrash, setIsDraggingToTrash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (task) {
      // If task is published, redirect to dashboard
      if (task.published) {
        navigate('/app');
        return;
      }
      setQuestions(task.questions);
      setIsLoading(false);
    } else if (taskId) {
      // Wait a bit for the task to be available (in case of timing issue)
      const timer = setTimeout(() => {
        const foundTask = getTaskById(taskId);
        if (foundTask) {
          // If task is published, redirect to dashboard
          if (foundTask.published) {
            navigate('/app');
            return;
          }
          setQuestions(foundTask.questions);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          // Only redirect if task still not found after waiting
          navigate('/app/tasks/create');
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      navigate('/app/tasks/create');
    }
  }, [task, taskId, navigate, getTaskById]);

  const isWeighted = useMemo(() => {
    return task?.markingCriteria?.markingScheme === 'weighted';
  }, [task?.markingCriteria?.markingScheme]);

  const handleAddQuestion = useCallback(() => {
    setEditingQuestion(null);
    setIsEditModalOpen(true);
  }, []);

  const handleEditQuestion = useCallback((question: QuestionData) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveQuestion = useCallback((questionData: QuestionData) => {
    if (!taskId) return;
    
    if (editingQuestion) {
      updateQuestion(taskId, editingQuestion.id, questionData);
    } else {
      addQuestion(taskId, questionData);
    }
  }, [taskId, editingQuestion, updateQuestion, addQuestion]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    if (!taskId) return;
    const question = questions.find(q => q.id === questionId);
    confirm({
      title: 'Delete Question',
      message: `Are you sure you want to delete "${question?.title || 'this question'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        deleteQuestion(taskId, questionId);
      },
    });
  }, [taskId, questions, deleteQuestion, confirm]);

  const handleDuplicateQuestion = useCallback((questionId: string) => {
    if (!taskId) return;
    const questionToDuplicate = questions.find(q => q.id === questionId);
    if (!questionToDuplicate) return;

    // Create a duplicate with a new ID and updated title
    const duplicatedQuestion: QuestionData = {
      ...questionToDuplicate,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: questionToDuplicate.title ? `${questionToDuplicate.title} (Copy)` : 'Untitled Question (Copy)',
      // Deep copy options and correctAnswers arrays
      options: questionToDuplicate.options ? [...questionToDuplicate.options] : [],
      correctAnswers: questionToDuplicate.correctAnswers ? [...questionToDuplicate.correctAnswers] : [],
    };

    // Find the index of the original question and insert the duplicate right after it
    const originalIndex = questions.findIndex(q => q.id === questionId);
    const newQuestions = [...questions];
    newQuestions.splice(originalIndex + 1, 0, duplicatedQuestion);
    
    // Update the questions state and add to task
    setQuestions(newQuestions);
    addQuestion(taskId, duplicatedQuestion);
  }, [taskId, questions, addQuestion]);

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDraggingToTrash(false);

    if (!taskId) return;

    // Check if dropped on trash
    if (over && over.id === 'trash') {
      const questionId = active.id as string;
      const question = questions.find(q => q.id === questionId);
      confirm({
        title: 'Delete Question',
        message: `Are you sure you want to delete "${question?.title || 'this question'}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: () => {
          deleteQuestion(taskId, questionId);
        },
      });
      return;
    }

    // Reorder questions
    if (over && active.id !== over.id) {
      setQuestions(prev => {
        const oldIndex = prev.findIndex(q => q.id === active.id);
        const newIndex = prev.findIndex(q => q.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const newQuestions = arrayMove(prev, oldIndex, newIndex);
        reorderQuestions(taskId, newQuestions.map(q => q.id));
        return newQuestions;
      });
    }
  }, [taskId, questions, deleteQuestion, reorderQuestions, confirm]);

  const handleDragOver = useCallback((event: any) => {
    if (event.over?.id === 'trash') {
      setIsDraggingToTrash(true);
    } else {
      setIsDraggingToTrash(false);
    }
  }, []);

  const handleMarksChange = useCallback((questionId: string, marks: number) => {
    if (!taskId) return;
    updateQuestion(taskId, questionId, { marks });
  }, [taskId, updateQuestion]);

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="empty-state">
            <p>Task not found</p>
            <Button onClick={() => navigate('/app/tasks')}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  const activeQuestion = activeId ? questions.find(q => q.id === activeId) : null;

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
                padding: 0,
              }}
            >
              ← Back
            </button>
            <h1 className="dashboard-title">{task.name}</h1>
            <p className="dashboard-subtitle">Design your questions and configure the task</p>
          </motion.div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<FiPlus />}
            onClick={handleAddQuestion}
          >
            Add Question
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <Card className="questions-container" glass={true}>
            <div className="questions-header">
              <h2>Questions ({questions.length})</h2>
              {isWeighted && (
                <div className="weighted-marks-info">
                  <span>Weighted marking enabled - Set marks per question</span>
                </div>
              )}
            </div>

            {questions.length === 0 ? (
              <div className="empty-questions-state">
                <FiFileText className="empty-icon" />
                <p>No questions yet. Click "Add Question" to get started.</p>
              </div>
            ) : (
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                <div className="questions-list">
                  <AnimatePresence>
                    {questions.map((question, index) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        index={index}
                        onEdit={() => handleEditQuestion(question)}
                        onDelete={() => handleDeleteQuestion(question.id)}
                        onDuplicate={() => handleDuplicateQuestion(question.id)}
                        showMarks={isWeighted}
                        onMarksChange={(marks) => handleMarksChange(question.id, marks)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            )}

            <TrashZone isActive={isDraggingToTrash} />
          </Card>

          <DragOverlay>
            {activeQuestion ? (
              <div className="question-item question-item-dragging">
                <div className="question-item-content">
                  <div className="question-number">{questions.findIndex(q => q.id === activeQuestion.id) + 1}</div>
                  <div className="question-main">
                    <h3 className="question-title">{activeQuestion.title || 'Untitled Question'}</h3>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="questions-actions">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            disabled={task?.published}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // Navigate to publishing screen
              navigate(`/app/tasks/${taskId}/publish`);
            }}
            disabled={task?.published}
          >
            Continue to Publish
          </Button>
        </div>
      </main>

      <EditQuestionModal
        question={editingQuestion}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};

export default QuestionsScreen;

