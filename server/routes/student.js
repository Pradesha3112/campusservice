const express = require('express');
const router = express.Router();
const { raiseRequest, supportRequest, getMyRequests, getRequestDetails, verifyCompletion, getActiveRequests, updateProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes are protected and for students only
router.use(protect);
router.use(authorize('student'));

// Raise a new request (with optional image upload)
router.post('/raise-request', upload.single('image'), raiseRequest);

// Support an existing request
router.put('/support/:id', supportRequest);

// Get student's own requests
router.get('/my-requests', getMyRequests);

// Get all active requests (for supporting)
router.get('/active-requests', getActiveRequests);

// Get single request details
router.get('/request/:id', getRequestDetails);

// Verify completion (rate and close or reopen)
router.put('/verify/:id', verifyCompletion);
router.put('/profile', updateProfile);

module.exports = router;