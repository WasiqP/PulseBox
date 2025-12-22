// Central export for all models
const User = require('./User');
const Class = require('./Class');
const Student = require('./Student');
const Task = require('./Task');
const Response = require('./Response');
const Attendance = require('./Attendance');
const Homework = require('./Homework');
const Schedule = require('./Schedule');

module.exports = {
  User,
  Class,
  Student,
  Task,
  Response,
  Attendance,
  Homework,
  Schedule,
};

