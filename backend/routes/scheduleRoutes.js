// Schedule Routes
const express = require('express');
const router = express.Router();
const { scheduleController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All schedule routes require authentication
// router.use(authenticate);

// GET /api/schedule
router.get('/', scheduleController.getAllSchedules);

// POST /api/schedule
router.post('/', scheduleController.createSchedule);

// PUT /api/schedule/:id
router.put('/:id', scheduleController.updateSchedule);

// DELETE /api/schedule/:id
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;

