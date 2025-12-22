// Attendance Model

const AttendanceSchema = {
  id: String,
  classId: String, // Reference to Class
  studentId: String, // Reference to Student
  studentName: String,
  studentEmail: String,
  date: Date, // Date of attendance
  status: {
    type: String,
    enum: ['present', 'late', 'absent']
  },
  markedBy: String, // Reference to User (teacher)
  notes: String, // Optional notes
  createdAt: Date,
  updatedAt: Date,
};

module.exports = AttendanceSchema;

