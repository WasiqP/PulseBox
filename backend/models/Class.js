// Class Model

const ClassSchema = {
  id: String,
  name: String,
  classType: {
    type: String,
    enum: ['single-subject', 'multi-subject']
  },
  subject: String, // For single-subject classes
  subjects: Array, // For multi-subject classes
  parentId: String, // ID of parent class (if this is a child/subject class)
  childClassIds: Array, // IDs of child classes (if this is a parent class)
  educationLevel: {
    type: String,
    enum: ['school', 'college', 'high-school', 'university', 'virtual', 'other']
  },
  gradeLevel: String,
  schedule: Object, // ClassSchedule object
  institutionName: String,
  location: String,
  roomNumber: String,
  students: Array, // Array of student IDs or student objects
  studentCount: Number,
  teacherId: String, // Reference to User
  createdAt: Date,
  updatedAt: Date,
};

module.exports = ClassSchema;

