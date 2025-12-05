import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type QuestionType = 
  | 'shortText' 
  | 'longText' 
  | 'multipleChoice' 
  | 'checkbox' 
  | 'dropdown';

export interface QuestionData {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  options?: string[];
  correctAnswers?: number[]; // Array of option indices
  marks?: number; // Marks for this question (only for weighted marking)
}

export interface TaskData {
  id: string;
  name: string;
  taskType: 'quiz' | 'test' | 'assignment' | 'homework';
  classId: string;
  subjectId?: string;
  dueDate: string;
  expectedTime: number;
  timeUnit: 'minutes' | 'hours';
  visibility: 'public' | 'class-only'; // Task visibility/sharing preference
  markingCriteria?: {
    totalMarks: number;
    passingMarks: number;
    passingPercentage: number;
    negativeMarking: boolean;
    negativeMarkingValue: number;
    autoGrade: boolean;
    markingScheme: 'equal' | 'weighted';
  };
  permissions: {
    lockScreen: boolean;
    preventTabSwitch: boolean;
    preventCopyPaste: boolean;
    showTimer: boolean;
  };
  questions: QuestionData[];
  createdAt: string;
  published?: boolean;
  publishedAt?: string;
  shareLink?: string;
}

interface TasksContextType {
  tasks: TaskData[];
  addTask: (task: Omit<TaskData, 'id' | 'createdAt' | 'questions'>) => string;
  updateTask: (id: string, task: Partial<TaskData>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => TaskData | undefined;
  addQuestion: (taskId: string, question: Omit<QuestionData, 'id'>) => void;
  updateQuestion: (taskId: string, questionId: string, question: Partial<QuestionData>) => void;
  deleteQuestion: (taskId: string, questionId: string) => void;
  reorderQuestions: (taskId: string, questionIds: string[]) => void;
  publishTask: (taskId: string) => string;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskData[]>(() => {
    const saved = localStorage.getItem('pulsebox-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Debounce localStorage writes to avoid blocking the main thread
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('pulsebox-tasks', JSON.stringify(tasks));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [tasks]);

  const addTask = useCallback((task: Omit<TaskData, 'id' | 'createdAt' | 'questions'>): string => {
    const newTask: TaskData = {
      ...task,
      visibility: task.visibility || 'public', // Default to public for backward compatibility
      id: Date.now().toString(),
      questions: [],
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  }, []);

  const updateTask = useCallback((id: string, task: Partial<TaskData>) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, ...task } : t)
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTaskById = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  const addQuestion = useCallback((taskId: string, question: Omit<QuestionData, 'id'>) => {
    const newQuestion: QuestionData = {
      ...question,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTasks(prev =>
      prev.map(t => 
        t.id === taskId 
          ? { ...t, questions: [...t.questions, newQuestion] }
          : t
      )
    );
  }, []);

  const updateQuestion = useCallback((taskId: string, questionId: string, question: Partial<QuestionData>) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              questions: t.questions.map(q =>
                q.id === questionId ? { ...q, ...question } : q
              )
            }
          : t
      )
    );
  }, []);

  const deleteQuestion = useCallback((taskId: string, questionId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              questions: t.questions.filter(q => q.id !== questionId)
            }
          : t
      )
    );
  }, []);

  const reorderQuestions = useCallback((taskId: string, questionIds: string[]) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const questionMap = new Map(t.questions.map(q => [q.id, q]));
        const reordered = questionIds.map(id => questionMap.get(id)).filter(Boolean) as QuestionData[];
        return { ...t, questions: reordered };
      })
    );
  }, []);

  const publishTask = useCallback((taskId: string): string => {
    const shareLink = `${window.location.origin}/task/${taskId}`;
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              published: true,
              publishedAt: new Date().toISOString(),
              shareLink,
            }
          : t
      )
    );
    return shareLink;
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        publishTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

