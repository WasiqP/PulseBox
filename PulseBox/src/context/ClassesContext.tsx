import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClassData {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  studentCount: number;
  schedule: string;
  roomNumber?: string;
  createdAt: string;
}

interface ClassesContextType {
  classes: ClassData[];
  addClass: (classData: ClassData) => Promise<void>;
  updateClass: (id: string, updates: Partial<ClassData>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const storedClasses = await AsyncStorage.getItem('classes');
      if (storedClasses) {
        setClasses(JSON.parse(storedClasses));
      } else {
        // Initialize with some default classes if none exist
        const defaultClasses: ClassData[] = [
          {
            id: '1',
            name: 'Mathematics 101',
            subject: 'Mathematics',
            gradeLevel: 'Grade 10',
            studentCount: 28,
            schedule: 'Mon, Wed, Fri - 9:00 AM',
            roomNumber: 'Room 205',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'English Literature',
            subject: 'English',
            gradeLevel: 'Grade 11',
            studentCount: 24,
            schedule: 'Tue, Thu - 10:30 AM',
            roomNumber: 'Room 301',
            createdAt: new Date().toISOString(),
          },
        ];
        setClasses(defaultClasses);
        await AsyncStorage.setItem('classes', JSON.stringify(defaultClasses));
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addClass = async (classData: ClassData) => {
    try {
      const updatedClasses = [classData, ...classes];
      setClasses(updatedClasses);
      await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const updateClass = async (id: string, updates: Partial<ClassData>) => {
    try {
      const updatedClasses = classes.map(cls => 
        cls.id === id ? { ...cls, ...updates } : cls
      );
      setClasses(updatedClasses);
      await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const updatedClasses = classes.filter(cls => cls.id !== id);
      setClasses(updatedClasses);
      await AsyncStorage.setItem('classes', JSON.stringify(updatedClasses));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <ClassesContext.Provider value={{ classes, addClass, updateClass, deleteClass, isLoading }}>
      {children}
    </ClassesContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassesProvider');
  }
  return context;
};


