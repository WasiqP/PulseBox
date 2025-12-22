// Attendance Routes
const express = require('express');
const router = express.Router();
const { attendanceController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All attendance routes require authentication
// router.use(authenticate);

// GET /api/attendance/class/:classId
router.get('/class/:classId', attendanceController.getAttendanceByClass);

// GET /api/attendance/class/:classId/date/:date
router.get('/class/:classId/date/:date', attendanceController.getAttendanceByClassAndDate);

// GET /api/attendance/student/:studentId
router.get('/student/:studentId', attendanceController.getStudentAttendance);

// POST /api/attendance
router.post('/', attendanceController.markAttendance);

// PUT /api/attendance/:id
router.put('/:id', attendanceController.updateAttendance);

// DELETE /api/attendance/:id
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;

