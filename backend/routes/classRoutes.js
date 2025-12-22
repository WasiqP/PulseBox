// Class Routes
const express = require('express');
const router = express.Router();
const { classController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All class routes require authentication
// router.use(authenticate);

// GET /api/classes
router.get('/', classController.getAllClasses);

// GET /api/classes/:id
router.get('/:id', classController.getClassById);

// POST /api/classes
router.post('/', classController.createClass);

// PUT /api/classes/:id
router.put('/:id', classController.updateClass);

// DELETE /api/classes/:id
router.delete('/:id', classController.deleteClass);

// POST /api/classes/:id/students
router.post('/:id/students', classController.addStudent);

// DELETE /api/classes/:id/students/:studentId
router.delete('/:id/students/:studentId', classController.removeStudent);

module.exports = router;

