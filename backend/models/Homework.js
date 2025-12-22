// Homework Model

const HomeworkSchema = {
  id: String,
  classId: String, // Reference to Class
  teacherId: String, // Reference to User
  title: String,
  description: String,
  subject: String,
  dueDate: Date,
  assignedDate: Date,
  maxGrade: Number,
  totalStudents: Number,
  submissions: Array, // Array of HomeworkSubmission objects
  createdAt: Date,
  updatedAt: Date,
};

module.exports = HomeworkSchema;

