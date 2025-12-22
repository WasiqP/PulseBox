// Task Response Model

const ResponseSchema = {
  id: String,
  taskId: String, // Reference to Task
  taskName: String,
  taskType: {
    type: String,
    enum: ['quiz', 'test', 'assignment', 'homework']
  },
  classId: String, // Reference to Class
  studentId: String, // Reference to Student (if authenticated)
  studentInfo: {
    name: String,
    email: String
  }, // For public responses or when student info is provided
  answers: Object, // Record<string, Answer>
  submittedAt: Date,
  timeSpent: Number, // in seconds
  score: Number,
  percentage: Number,
  passed: Boolean,
  isGraded: Boolean,
  feedback: String,
  gradedBy: String, // Reference to User (teacher who graded)
  gradedAt: Date,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = ResponseSchema;

