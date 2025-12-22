// Response Routes
const express = require('express');
const router = express.Router();
const { responseController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// Public route for submitting responses
// POST /api/responses (public - for students/guests)
router.post('/', responseController.submitResponse);

// Protected routes (require authentication)
// router.use(authenticate);

// GET /api/responses
router.get('/', responseController.getAllResponses);

// GET /api/responses/task/:taskId
router.get('/task/:taskId', responseController.getResponsesByTask);

// GET /api/responses/:id
router.get('/:id', responseController.getResponseById);

// PUT /api/responses/:id/grade
router.put('/:id/grade', responseController.gradeResponse);

// DELETE /api/responses/:id
router.delete('/:id', responseController.deleteResponse);

// GET /api/responses/task/:taskId/statistics
router.get('/task/:taskId/statistics', responseController.getTaskStatistics);

module.exports = router;

