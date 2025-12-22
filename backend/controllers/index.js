// Central export for all controllers
const authController = require('./authController');
const userController = require('./userController');
const classController = require('./classController');
const studentController = require('./studentController');
const taskController = require('./taskController');
const responseController = require('./responseController');
const attendanceController = require('./attendanceController');
const homeworkController = require('./homeworkController');
const scheduleController = require('./scheduleController');
const analyticsController = require('./analyticsController');

module.exports = {
  authController,
  userController,
  classController,
  studentController,
  taskController,
  responseController,
  attendanceController,
  homeworkController,
  scheduleController,
  analyticsController,
};

