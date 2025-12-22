// Central router that combines all route modules
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');
const studentRoutes = require('./studentRoutes');
const taskRoutes = require('./taskRoutes');
const responseRoutes = require('./responseRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const homeworkRoutes = require('./homeworkRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/tasks', taskRoutes);
router.use('/responses', responseRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/homework', homeworkRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;

