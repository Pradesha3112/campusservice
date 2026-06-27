const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', auth.protect, getMe);

module.exports = router;