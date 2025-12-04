import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type HomeworkStatus = 'pending' | 'submitted' | 'graded' | 'late';

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt?: string;
  submittedContent?: string;
  attachmentUrl?: string;
  grade?: number;
  feedback?: string;
  status: HomeworkStatus;
  createdAt: string;
}

export interface Homework {
  id: string;
  classId: string;
  title: string;
  description: string;
  subject?: string;
  dueDate: string;
  assignedDate: string;
  maxGrade?: number;
  submissions: HomeworkSubmission[];
  totalStudents: number;
  createdAt: string;
}

interface HomeworkContextType {
  homeworks: Homework[];
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => void;
  updateHomework: (id: string, homework: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;
  getHomeworkById: (id: string) => Homework | undefined;
  getHomeworksByClass: (classId: string) => Homework[];
  addSubmission: (homeworkId: string, submission: Omit<HomeworkSubmission, 'id' | 'createdAt'>) => void;
  updateSubmission: (homeworkId: string, submissionId: string, submission: Partial<HomeworkSubmission>) => void;
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

export const useHomework = () => {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error('useHomework must be used within a HomeworkProvider');
  }
  return context;
};

interface HomeworkProviderProps {
  children: ReactNode;
}

export const HomeworkProvider: React.FC<HomeworkProviderProps> = ({ children }) => {
  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem('pulsebox-homework');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pulsebox-homework', JSON.stringify(homeworks));
  }, [homeworks]);

  const addHomework = (homework: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => {
    const newHomework: Homework = {
      ...homework,
      id: Date.now().toString(),
      submissions: [],
      createdAt: new Date().toISOString()
    };
    setHomeworks(prev => [...prev, newHomework]);
  };

  const updateHomework = (id: string, homework: Partial<Homework>) => {
    setHomeworks(prev =>
      prev.map(hw => hw.id === id ? { ...hw, ...homework } : hw)
    );
  };

  const deleteHomework = (id: string) => {
    setHomeworks(prev => prev.filter(hw => hw.id !== id));
  };

  const getHomeworkById = (id: string) => {
    return homeworks.find(hw => hw.id === id);
  };

  const getHomeworksByClass = (classId: string) => {
    return homeworks.filter(hw => hw.classId === classId);
  };

  const addSubmission = (homeworkId: string, submission: Omit<HomeworkSubmission, 'id' | 'createdAt'>) => {
    setHomeworks(prev =>
      prev.map(hw => {
        if (hw.id === homeworkId) {
          const newSubmission: HomeworkSubmission = {
            ...submission,
            id: `${homeworkId}-${submission.studentId}-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          // Check if submission already exists
          const existingIndex = hw.submissions.findIndex(s => s.studentId === submission.studentId);
          if (existingIndex >= 0) {
            const updated = [...hw.submissions];
            updated[existingIndex] = newSubmission;
            return { ...hw, submissions: updated };
          }
          return { ...hw, submissions: [...hw.submissions, newSubmission] };
        }
        return hw;
      })
    );
  };

  const updateSubmission = (homeworkId: string, submissionId: string, submission: Partial<HomeworkSubmission>) => {
    setHomeworks(prev =>
      prev.map(hw => {
        if (hw.id === homeworkId) {
          return {
            ...hw,
            submissions: hw.submissions.map(s =>
              s.id === submissionId ? { ...s, ...submission } : s
            )
          };
        }
        return hw;
      })
    );
  };

  return (
    <HomeworkContext.Provider
      value={{
        homeworks,
        addHomework,
        updateHomework,
        deleteHomework,
        getHomeworkById,
        getHomeworksByClass,
        addSubmission,
        updateSubmission
      }}
    >
      {children}
    </HomeworkContext.Provider>
  );
};

