// Analytics Routes
const express = require('express');
const router = express.Router();
const { analyticsController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All analytics routes require authentication
// router.use(authenticate);

// GET /api/analytics/overview
router.get('/overview', analyticsController.getOverview);

// GET /api/analytics/class-performance
router.get('/class-performance', analyticsController.getClassPerformance);

module.exports = router;

