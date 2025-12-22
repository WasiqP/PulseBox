// Task Routes
const express = require('express');
const router = express.Router();
const { taskController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All task routes require authentication
// router.use(authenticate);

// GET /api/tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// POST /api/tasks
router.post('/', taskController.createTask);

// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

// POST /api/tasks/:id/publish
router.post('/:id/publish', taskController.publishTask);

// GET /api/tasks/:id/questions
router.get('/:id/questions', taskController.getTaskQuestions);

// PUT /api/tasks/:id/questions
router.put('/:id/questions', taskController.updateTaskQuestions);

module.exports = router;

