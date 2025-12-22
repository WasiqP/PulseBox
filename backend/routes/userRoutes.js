// User Routes
const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
// const { authenticate } = require('../middleware/auth');

// All user routes require authentication
// router.use(authenticate);

// GET /api/users/profile
router.get('/profile', userController.getProfile);

// PUT /api/users/profile
router.put('/profile', userController.updateProfile);

// PUT /api/users/change-password
router.put('/change-password', userController.changePassword);

module.exports = router;

