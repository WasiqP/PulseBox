import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { TaskData, QuestionData } from './TasksContext';

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface StudentInfo {
  name: string;
  email: string;
}

export interface TaskResponse {
  id: string;
  taskId: string;
  taskName: string;
  taskType: 'quiz' | 'test' | 'assignment' | 'homework';
  classId: string;
  studentInfo: StudentInfo | null;
  answers: Record<string, Answer>;
  submittedAt: string;
  timeSpent?: number; // in seconds
  score?: number;
  percentage?: number;
  passed?: boolean;
  isGraded: boolean;
  feedback?: string;
}

interface ResponsesContextType {
  responses: TaskResponse[];
  addResponse: (response: Omit<TaskResponse, 'id'>) => string;
  getResponsesByTaskId: (taskId: string) => TaskResponse[];
  getResponseById: (responseId: string) => TaskResponse | undefined;
  deleteResponse: (responseId: string) => void;
  updateResponse: (responseId: string, updates: Partial<TaskResponse>) => void;
  getLatestResponses: (limit?: number) => TaskResponse[];
  getTaskStatistics: (taskId: string) => {
    totalResponses: number;
    averageScore?: number;
    passRate?: number;
    completionRate: number;
  };
}

const ResponsesContext = createContext<ResponsesContextType | undefined>(undefined);

interface ResponsesProviderProps {
  children: ReactNode;
}

export const ResponsesProvider: React.FC<ResponsesProviderProps> = ({ children }) => {
  const [responses, setResponses] = useState<TaskResponse[]>(() => {
    const saved = localStorage.getItem('pulsebox-responses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('pulsebox-responses', JSON.stringify(responses));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [responses]);

  const addResponse = useCallback((response: Omit<TaskResponse, 'id'>): string => {
    const newResponse: TaskResponse = {
      ...response,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isGraded: response.isGraded || false,
    };
    setResponses(prev => [newResponse, ...prev]); // Add to beginning for latest first
    return newResponse.id;
  }, []);

  const getResponsesByTaskId = useCallback((taskId: string) => {
    return responses.filter(r => r.taskId === taskId).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [responses]);

  const getResponseById = useCallback((responseId: string) => {
    return responses.find(r => r.id === responseId);
  }, [responses]);

  const deleteResponse = useCallback((responseId: string) => {
    setResponses(prev => prev.filter(r => r.id !== responseId));
  }, []);

  const updateResponse = useCallback((responseId: string, updates: Partial<TaskResponse>) => {
    setResponses(prev =>
      prev.map(r => r.id === responseId ? { ...r, ...updates } : r)
    );
  }, []);

  const getLatestResponses = useCallback((limit: number = 10) => {
    return responses
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, limit);
  }, [responses]);

  const getTaskStatistics = useCallback((taskId: string) => {
    const taskResponses = responses.filter(r => r.taskId === taskId);
    const totalResponses = taskResponses.length;
    
    if (totalResponses === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
      };
    }

    const scoredResponses = taskResponses.filter(r => r.score !== undefined);
    const averageScore = scoredResponses.length > 0
      ? scoredResponses.reduce((sum, r) => sum + (r.score || 0), 0) / scoredResponses.length
      : undefined;

    const passedCount = taskResponses.filter(r => r.passed === true).length;
    const passRate = scoredResponses.length > 0
      ? (passedCount / scoredResponses.length) * 100
      : undefined;

    // Completion rate would need task data to calculate properly
    // For now, we'll assume all responses are complete
    const completionRate = 100;

    return {
      totalResponses,
      averageScore,
      passRate,
      completionRate,
    };
  }, [responses]);

  return (
    <ResponsesContext.Provider
      value={{
        responses,
        addResponse,
        getResponsesByTaskId,
        getResponseById,
        deleteResponse,
        updateResponse,
        getLatestResponses,
        getTaskStatistics,
      }}
    >
      {children}
    </ResponsesContext.Provider>
  );
};

export const useResponses = () => {
  const context = useContext(ResponsesContext);
  if (context === undefined) {
    throw new Error('useResponses must be used within a ResponsesProvider');
  }
  return context;
};

