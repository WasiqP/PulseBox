import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
}

// Schedule interface for class timing
export interface ClassSchedule {
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string; // Format: "HH:MM" (24-hour format)
  days: string[]; // Array of day abbreviations: ['Mon', 'Tue', 'Wed', etc.]
}

// ClassData interface for managing class information
export interface ClassData {
  id: string;
  name: string;
  classType: 'single-subject' | 'multi-subject';
  subject?: string; // For single-subject classes
  subjects?: Subject[]; // For multi-subject classes
  educationLevel: 'school' | 'college' | 'high-school' | 'university' | 'virtual' | 'other';
  gradeLevel: string;
  schedule: ClassSchedule | string; // Support both new format and legacy string format
  institutionName?: string;
  location?: string;
  roomNumber?: string;
  students: Student[];
  studentCount: number;
  createdAt: string;
}

interface ClassesContextType {
  classes: ClassData[];
  addClass: (classData: Omit<ClassData, 'id' | 'createdAt'>) => void;
  updateClass: (id: string, classData: Partial<ClassData>) => void;
  deleteClass: (id: string) => void;
  getClassById: (id: string) => ClassData | undefined;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassesProvider');
  }
  return context;
};

// Utility function to format schedule for display
export const formatSchedule = (schedule: ClassSchedule | string): string => {
  if (typeof schedule === 'string') {
    return schedule; // Legacy string format
  }
  
  // Format time from 24-hour to 12-hour format
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };
  
  const startTime = formatTime(schedule.startTime);
  const endTime = formatTime(schedule.endTime);
  const days = schedule.days.join(', ');
  
  return `${days} ${startTime} - ${endTime}`;
};

interface ClassesProviderProps {
  children: ReactNode;
}

export const ClassesProvider: React.FC<ClassesProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<ClassData[]>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('pulsebox-classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Default mock data
    return [
      { 
        id: '1', 
        name: 'Mathematics - Grade 10', 
        classType: 'single-subject',
        subject: 'Math', 
        gradeLevel: 'Grade 10', 
        students: [], 
        studentCount: 28, 
        schedule: 'Mon, Wed, Fri 9:00 AM', 
        roomNumber: 'Room 201',
        createdAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'English Literature', 
        classType: 'single-subject',
        subject: 'English', 
        gradeLevel: 'Grade 11', 
        students: [], 
        studentCount: 24, 
        schedule: 'Tue, Thu 10:30 AM', 
        roomNumber: 'Room 105',
        createdAt: new Date().toISOString()
      },
      { 
        id: '3', 
        name: 'Grade 1', 
        classType: 'multi-subject',
        subjects: [
          { id: '1', name: 'Mathematics' },
          { id: '2', name: 'English' }
        ],
        gradeLevel: 'Grade 1', 
        students: [], 
        studentCount: 22, 
        schedule: 'Mon, Wed 2:00 PM', 
        roomNumber: 'Lab 3',
        createdAt: new Date().toISOString()
      },
    ];
  });

  // Save to localStorage whenever classes change
  useEffect(() => {
    localStorage.setItem('pulsebox-classes', JSON.stringify(classes));
  }, [classes]);

  const addClass = (classData: Omit<ClassData, 'id' | 'createdAt'>) => {
    const newClass: ClassData = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, classData: Partial<ClassData>) => {
    setClasses(prev => 
      prev.map(cls => cls.id === id ? { ...cls, ...classData } : cls)
    );
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
  };

  const getClassById = (id: string) => {
    return classes.find(cls => cls.id === id);
  };

  return (
    <ClassesContext.Provider value={{ classes, addClass, updateClass, deleteClass, getClassById }}>
      {children}
    </ClassesContext.Provider>
  );
};

