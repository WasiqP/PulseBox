// Student Model

const StudentSchema = {
  id: String,
  name: String,
  email: String,
  classIds: Array, // Array of class IDs the student belongs to
  parentEmail: String, // For parent communication
  parentName: String,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = StudentSchema;

