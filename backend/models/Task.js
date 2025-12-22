// Task Model (Quiz, Test, Assignment, Homework)

const TaskSchema = {
  id: String,
  name: String,
  taskType: {
    type: String,
    enum: ['quiz', 'test', 'assignment', 'homework']
  },
  classId: String, // Reference to Class
  subjectId: String, // For multi-subject classes
  teacherId: String, // Reference to User
  dueDate: Date,
  expectedTime: Number,
  timeUnit: {
    type: String,
    enum: ['minutes', 'hours']
  },
  visibility: {
    type: String,
    enum: ['public', 'class-only'],
    default: 'class-only'
  },
  requireIdentification: Boolean,
  displayMode: {
    type: String,
    enum: ['single', 'form'],
    default: 'single'
  },
  markingCriteria: {
    totalMarks: Number,
    passingMarks: Number,
    passingPercentage: Number,
    negativeMarking: Boolean,
    negativeMarkingValue: Number,
    autoGrade: Boolean,
    markingScheme: {
      type: String,
      enum: ['equal', 'weighted']
    }
  },
  permissions: {
    lockScreen: Boolean,
    preventTabSwitch: Boolean,
    preventCopyPaste: Boolean,
    showTimer: Boolean
  },
  questions: Array, // Array of QuestionData objects
  published: Boolean,
  publishedAt: Date,
  shareLink: String,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = TaskSchema;

