// Schedule Model

const ScheduleSchema = {
  id: String,
  classId: String, // Reference to Class
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  location: String,
  type: {
    type: String,
    enum: ['class', 'exam', 'event', 'meeting']
  },
  teacherId: String, // Reference to User
  createdAt: Date,
  updatedAt: Date,
};

module.exports = ScheduleSchema;

