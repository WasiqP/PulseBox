import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EventType = 
  | 'class' 
  | 'meeting' 
  | 'office-hours' 
  | 'grading' 
  | 'lesson-planning' 
  | 'professional-development' 
  | 'personal' 
  | 'other';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  allDay?: boolean;
  classId?: string; // If linked to a class
  location?: string;
  attendees?: string[];
  reminder?: {
    enabled: boolean;
    minutesBefore: number; // How many minutes before the event to remind
  };
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // Every X days/weeks/months/years
    endDate?: string; // When recurring ends
    daysOfWeek?: number[]; // For weekly: [0=Sunday, 1=Monday, etc.]
  };
  color?: string; // Custom color override
  createdAt: string;
  updatedAt: string;
}

interface ScheduleContextType {
  events: ScheduleEvent[];
  addEvent: (event: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<ScheduleEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => ScheduleEvent | undefined;
  getEventsByDate: (date: Date) => ScheduleEvent[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => ScheduleEvent[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('pulsebox-schedule');
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
    localStorage.setItem('pulsebox-schedule', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<ScheduleEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getEventsByDate = (date: Date) => {
    // Compare dates by year, month, and day only (ignore time and timezone)
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getFullYear() === targetYear &&
             eventDate.getMonth() === targetMonth &&
             eventDate.getDate() === targetDay;
    });
  };

  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= startDate && eventStart <= endDate;
    });
  };

  return (
    <ScheduleContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        getEventsByDate,
        getEventsByDateRange
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

