import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useSchedule, type ScheduleEvent, type EventType } from '../context/ScheduleContext';
import { useClasses } from '../context/ClassesContext';
import {
  FiCalendar,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiX,
  FiBook,
  FiBriefcase,
  FiFileText,
  FiUser,
  FiCoffee,
  FiTarget,
  FiMoreHorizontal,
  FiBell
} from 'react-icons/fi';
import './SchedulePage.css';

type ViewMode = 'month' | 'week' | 'day';

const eventTypeConfig: Record<EventType, { label: string; icon: typeof FiBook; color: string }> = {
  class: { label: 'Class', icon: FiBook, color: '#A060FF' },
  meeting: { label: 'Meeting', icon: FiUsers, color: '#00E4E3' },
  'office-hours': { label: 'Office Hours', icon: FiCoffee, color: '#4DFF88' },
  grading: { label: 'Grading', icon: FiFileText, color: '#FF6B6B' },
  'lesson-planning': { label: 'Lesson Planning', icon: FiTarget, color: '#FFD93D' },
  'professional-development': { label: 'Professional Development', icon: FiBriefcase, color: '#9B59B6' },
  personal: { label: 'Personal', icon: FiUser, color: '#95A5A6' },
  other: { label: 'Other', icon: FiMoreHorizontal, color: '#7F8C8D' }
};

const SchedulePage = () => {
  const { events, addEvent, updateEvent, deleteEvent, getEventsByDate, getEventsByDateRange } = useSchedule();
  const { classes } = useClasses();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [prefilledDateTime, setPrefilledDateTime] = useState<{ start?: string; end?: string } | null>(null);

  // Get first and last day of current view
  const getViewRange = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (viewMode === 'month') {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return { start: firstDay, end: lastDay };
    } else if (viewMode === 'week') {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day;
      const start = new Date(currentDate.setDate(diff));
      const end = new Date(currentDate.setDate(diff + 6));
      return { start, end };
    } else {
      return { start: new Date(currentDate), end: new Date(currentDate) };
    }
  };

  const viewRange = getViewRange();
  const viewEvents = getEventsByDateRange(viewRange.start, viewRange.end);

  // Generate calendar days for month view
  const calendarDays = useMemo(() => {
    if (viewMode !== 'month') return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    
    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonth.getDate() - i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate, viewMode]);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateEvent = (date?: Date, hour?: number) => {
    setSelectedEvent(null);
    setIsEditing(false);
    
    if (date) {
      // Use local date components to avoid timezone issues
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      
      // Format for datetime-local input (YYYY-MM-DDTHH:mm) - uses local time
      const formatForInput = (y: number, m: number, d: number, h: number, min: number = 0) => {
        const monthStr = String(m + 1).padStart(2, '0');
        const dayStr = String(d).padStart(2, '0');
        const hoursStr = String(h).padStart(2, '0');
        const minutesStr = String(min).padStart(2, '0');
        return `${y}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}`;
      };
      
      if (hour !== undefined) {
        // Set to the exact hour clicked (e.g., 2 PM = 14:00)
        setPrefilledDateTime({
          start: formatForInput(year, month, day, hour, 0),
          end: formatForInput(year, month, day, hour + 1, 0)
        });
      } else {
        // Default to 9 AM for month/week view
        setPrefilledDateTime({
          start: formatForInput(year, month, day, 9, 0),
          end: formatForInput(year, month, day, 10, 0)
        });
      }
    } else {
      setPrefilledDateTime(null);
    }
    
    setShowEventModal(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

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
            <h1 className="dashboard-title">My Schedule</h1>
            <p className="dashboard-subtitle">Manage your time and appointments</p>
          </motion.div>

          <div className="schedule-header-actions">
            <div className="view-mode-selector">
              <button
                className={`view-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'day' ? 'active' : ''}`}
                onClick={() => setViewMode('day')}
              >
                Day
              </button>
            </div>
            <Button variant="primary" size="md" leftIcon={<FiPlus />} onClick={handleCreateEvent}>
              New Event
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="schedule-card" glass={true}>
            <div className="schedule-navigation">
              <button className="nav-btn" onClick={handlePrevious}>
                <FiChevronLeft />
              </button>
              <div className="schedule-date-display">
                <h2>{formatDate(currentDate)}</h2>
                <button className="today-btn" onClick={handleToday}>
                  Today
                </button>
              </div>
              <button className="nav-btn" onClick={handleNext}>
                <FiChevronRight />
              </button>
            </div>

            {viewMode === 'month' && (
              <div className="calendar-month-view">
                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-weekday">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="calendar-days-grid">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsByDate(day);
                    const isTodayDate = isToday(day);
                    const isCurrentMonthDate = isCurrentMonth(day);

                    return (
                      <div
                        key={index}
                        className={`calendar-day ${!isCurrentMonthDate ? 'other-month' : ''} ${isTodayDate ? 'today' : ''}`}
                        onClick={(e) => {
                          // Only create event if clicking on the day itself, not on events
                          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.calendar-day-number')) {
                            handleCreateEvent(day);
                          }
                        }}
                        title="Click to create event"
                      >
                        <div className="calendar-day-number">{day.getDate()}</div>
                        <div className="calendar-day-events">
                          {dayEvents.slice(0, 3).map(event => {
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={event.id}
                                className="calendar-event-preview"
                                style={{ borderLeftColor: config.color }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEvent(event);
                                }}
                                title={event.title}
                              >
                                <Icon style={{ fontSize: '0.75rem', color: config.color }} />
                                <span className="event-preview-title">{event.title}</span>
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div className="calendar-event-more">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'week' && (
              <div className="calendar-week-view">
                <div className="week-days">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(viewRange.start);
                    date.setDate(date.getDate() + i);
                    const dayEvents = getEventsByDate(date);
                    
                    return (
                      <div 
                        key={i} 
                        className="week-day"
                        onClick={(e) => {
                          // Only create event if clicking on empty space
                          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.week-day-header')) {
                            handleCreateEvent(date);
                          }
                        }}
                        title="Click to create event"
                      >
                        <div className={`week-day-header ${isToday(date) ? 'today' : ''}`}>
                          <div className="week-day-name">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="week-day-number">{date.getDate()}</div>
                        </div>
                        <div className="week-day-events">
                          {dayEvents.map(event => {
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={event.id}
                                className="week-event"
                                style={{ borderLeftColor: config.color }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEvent(event);
                                }}
                              >
                                <div className="week-event-time">
                                  {formatTime(event.startTime)}
                                </div>
                                <div className="week-event-title">{event.title}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="calendar-day-view">
                <div className="day-view-header">
                  <h3>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                </div>
                <div className="day-view-timeline">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const hourDate = new Date(currentDate);
                    hourDate.setHours(hour, 0, 0, 0);
                    const nextHourDate = new Date(hourDate);
                    nextHourDate.setHours(hour + 1, 0, 0, 0);
                    
                    // Get events that occur during this hour (start or span this hour)
                    const hourEvents = getEventsByDate(currentDate).filter(event => {
                      const eventStart = new Date(event.startTime);
                      const eventEnd = new Date(event.endTime);
                      const eventStartHour = eventStart.getHours();
                      const eventEndHour = eventEnd.getHours();
                      // Event starts in this hour OR event spans this hour OR event is ongoing during this hour
                      return (eventStartHour === hour) ||
                             (eventStartHour < hour && eventEndHour >= hour) ||
                             (eventStart < hourDate && eventEnd > hourDate);
                    });

                    return (
                      <div 
                        key={hour} 
                        className="day-view-hour"
                        onClick={(e) => {
                          // Only create event if clicking on empty space or hour label
                          if (e.target === e.currentTarget || 
                              (e.target as HTMLElement).closest('.day-view-hour-label') || 
                              (hourEvents.length === 0 && (e.target as HTMLElement).closest('.day-view-hour-content'))) {
                            // Create a new date object for the clicked hour
                            const clickedDate = new Date(currentDate);
                            clickedDate.setHours(hour, 0, 0, 0);
                            handleCreateEvent(clickedDate, hour);
                          }
                        }}
                        title={`Click to create event at ${hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}`}
                      >
                        <div className="day-view-hour-label">
                          {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>
                        <div className="day-view-hour-content">
                          {hourEvents.map(event => {
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={event.id}
                                className="day-event"
                                style={{ borderLeftColor: config.color }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEvent(event);
                                }}
                              >
                                <Icon style={{ color: config.color }} />
                                <div className="day-event-content">
                                  <div className="day-event-title">{event.title}</div>
                                  <div className="day-event-time">
                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Event Modal */}
        {showEventModal && (
          <EventModal
            event={selectedEvent}
            isEditing={isEditing}
            classes={classes}
            prefilledDateTime={prefilledDateTime}
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
              setPrefilledDateTime(null);
            }}
            onSave={(eventData) => {
              if (isEditing && selectedEvent) {
                updateEvent(selectedEvent.id, eventData);
              } else {
                addEvent(eventData);
              }
              setShowEventModal(false);
              setSelectedEvent(null);
              setPrefilledDateTime(null);
            }}
            onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
          />
        )}
      </main>
    </div>
  );
};

// Event Modal Component
interface EventModalProps {
  event: ScheduleEvent | null;
  isEditing: boolean;
  classes: any[];
  prefilledDateTime?: { start?: string; end?: string } | null;
  onClose: () => void;
  onSave: (eventData: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isEditing, classes, prefilledDateTime, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    type: (event?.type || 'class') as EventType,
    startTime: event?.startTime 
      ? new Date(event.startTime).toISOString().slice(0, 16) 
      : prefilledDateTime?.start || '',
    endTime: event?.endTime 
      ? new Date(event.endTime).toISOString().slice(0, 16) 
      : prefilledDateTime?.end || '',
    allDay: event?.allDay || false,
    classId: event?.classId || '',
    location: event?.location || '',
    reminderEnabled: event?.reminder?.enabled || false,
    reminderMinutes: event?.reminder?.minutesBefore || 15
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert datetime-local string to ISO string preserving local date/time
    // datetime-local format: "YYYY-MM-DDTHH:mm" (local time, no timezone)
    const convertToISO = (dateTimeLocal: string) => {
      // Parse the datetime-local string
      const [datePart, timePart] = dateTimeLocal.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Create date object in local timezone
      // This creates a date representing the local date/time
      const localDate = new Date(year, month - 1, day, hours, minutes);
      
      // Convert to ISO string - this will properly handle timezone conversion
      // The Date object already knows the local timezone, so toISOString() will convert correctly
      return localDate.toISOString();
    };

    onSave({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      startTime: convertToISO(formData.startTime),
      endTime: convertToISO(formData.endTime),
      allDay: formData.allDay,
      classId: formData.classId || undefined,
      location: formData.location || undefined,
      reminder: formData.reminderEnabled ? {
        enabled: true,
        minutesBefore: formData.reminderMinutes
      } : undefined
    });
  };

  const reminderOptions = [
    { label: 'At time of event', value: 0 },
    { label: '5 minutes before', value: 5 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
    { label: '2 hours before', value: 120 },
    { label: '1 day before', value: 1440 }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="event-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="event-modal-header">
          <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-modal-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Math Class, Parent Meeting"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
              required
            >
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              />
              All Day Event
            </label>
          </div>

          {formData.type === 'class' && (
            <div className="form-group">
              <label>Link to Class (Optional)</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Location (Optional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Room 201, Online, Library"
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes or details about this event"
              rows={4}
            />
          </div>

          <div className="form-group">
            <div className="reminder-section">
              <label className="reminder-toggle-label">
                <input
                  type="checkbox"
                  checked={formData.reminderEnabled}
                  onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                />
                <span>Remind Me</span>
              </label>
              {formData.reminderEnabled && (
                <div className="reminder-options">
                  <label className="reminder-select-label">Remind me:</label>
                  <select
                    value={formData.reminderMinutes}
                    onChange={(e) => setFormData({ ...formData, reminderMinutes: parseInt(e.target.value) })}
                    className="reminder-select"
                  >
                    {reminderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="event-modal-actions">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={onDelete}
                style={{ color: '#FF6B6B', borderColor: '#FF6B6B' }}
              >
                <FiTrash2 />
                Delete
              </Button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SchedulePage;

