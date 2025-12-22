// Homework Routes
const express = require('express');
const router = express.Router();
const { homeworkController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All homework routes require authentication
// router.use(authenticate);

// GET /api/homework/class/:classId
router.get('/class/:classId', homeworkController.getHomeworkByClass);

// POST /api/homework
router.post('/', homeworkController.createHomework);

// PUT /api/homework/:id
router.put('/:id', homeworkController.updateHomework);

// DELETE /api/homework/:id
router.delete('/:id', homeworkController.deleteHomework);

module.exports = router;

