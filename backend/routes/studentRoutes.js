// Student Routes
const express = require('express');
const router = express.Router();
const { studentController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All student routes require authentication
// router.use(authenticate);

// GET /api/students/:id
router.get('/:id', studentController.getStudentById);

// GET /api/students/:id/performance
router.get('/:id/performance', studentController.getStudentPerformance);

// GET /api/students/:id/report
router.get('/:id/report', studentController.getStudentReport);

module.exports = router;

