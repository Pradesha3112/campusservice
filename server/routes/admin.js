const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  verifyRequest,
  rejectRequest,
  assignStaff,
  getAllStaff,
  getAllUsers,
  createStaff,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Request management
router.get('/requests', getAllRequests);
router.put('/verify/:id', verifyRequest);
router.put('/reject/:id', rejectRequest);
router.put('/assign/:id', assignStaff);

// User management
router.get('/staff', getAllStaff);
router.get('/users', getAllUsers);
router.post('/create-staff', createStaff);

module.exports = router;