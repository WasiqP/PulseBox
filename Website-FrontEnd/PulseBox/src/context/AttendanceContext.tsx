import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: AttendanceStatus;
  createdAt: string;
}

interface AttendanceContextType {
  records: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => void;
  addAttendanceRecords: (records: Omit<AttendanceRecord, 'id' | 'createdAt'>[]) => void;
  getAttendanceByClass: (classId: string) => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  getAttendanceByClassAndDate: (classId: string, date: string) => AttendanceRecord[];
  getStudentAttendance: (studentId: string, classId?: string) => AttendanceRecord[];
  deleteAttendanceRecord: (id: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('pulsebox-attendance');
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
    localStorage.setItem('pulsebox-attendance', JSON.stringify(records));
  }, [records]);

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `${record.classId}-${record.date}-${record.studentId}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setRecords(prev => {
      // Remove existing record for same class, date, and student
      const filtered = prev.filter(r => 
        !(r.classId === record.classId && r.date === record.date && r.studentId === record.studentId)
      );
      return [...filtered, newRecord];
    });
  };

  const addAttendanceRecords = (recordsToAdd: Omit<AttendanceRecord, 'id' | 'createdAt'>[]) => {
    const newRecords: AttendanceRecord[] = recordsToAdd.map(record => ({
      ...record,
      id: `${record.classId}-${record.date}-${record.studentId}-${Date.now()}`,
      createdAt: new Date().toISOString()
    }));
    
    setRecords(prev => {
      // Remove existing records for same class and date
      const classId = recordsToAdd[0]?.classId;
      const date = recordsToAdd[0]?.date;
      const filtered = prev.filter(r => 
        !(r.classId === classId && r.date === date)
      );
      return [...filtered, ...newRecords];
    });
  };

  const getAttendanceByClass = (classId: string) => {
    return records.filter(r => r.classId === classId);
  };

  const getAttendanceByDate = (date: string) => {
    return records.filter(r => r.date === date);
  };

  const getAttendanceByClassAndDate = (classId: string, date: string) => {
    return records.filter(r => r.classId === classId && r.date === date);
  };

  const getStudentAttendance = (studentId: string, classId?: string) => {
    if (classId) {
      return records.filter(r => r.studentId === studentId && r.classId === classId);
    }
    return records.filter(r => r.studentId === studentId);
  };

  const deleteAttendanceRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <AttendanceContext.Provider value={{
      records,
      addAttendanceRecord,
      addAttendanceRecords,
      getAttendanceByClass,
      getAttendanceByDate,
      getAttendanceByClassAndDate,
      getStudentAttendance,
      deleteAttendanceRecord
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};



