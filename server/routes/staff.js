const express = require('express');
const router = express.Router();
const {
  getMyTasks,
  startWork,
  updateProgress,
  completeWork,
  getRequestDetails,
  getProfile,
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes are protected and for staff only
router.use(protect);
router.use(authorize('staff'));

// Tasks
router.get('/my-tasks', getMyTasks);
router.get('/request/:id', getRequestDetails);

// Work management
router.put('/start-work/:id', upload.single('beforeImage'), startWork);
router.put('/update-progress/:id', updateProgress);
router.put('/complete-work/:id', upload.single('afterImage'), completeWork);

// Profile
router.get('/profile', getProfile);

module.exports = router;