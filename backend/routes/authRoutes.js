// Authentication Routes
const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

module.exports = router;

