// User Model
// This will be used with your database (MongoDB, PostgreSQL, etc.)

const UserSchema = {
  id: String,
  email: String,
  name: String,
  password: String, // Hashed
  role: {
    type: String,
    enum: ['teacher', 'student', 'admin'],
    default: 'teacher'
  },
  avatar: String,
  createdAt: Date,
  updatedAt: Date,
};

module.exports = UserSchema;

