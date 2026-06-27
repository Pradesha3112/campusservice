const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Raise a new service request
// @route   POST /api/student/raise-request
// @access  Private (Student)
const raiseRequest = async (req, res) => {
  try {
    const {
      category,
      serviceType,
      building,
      floor,
      room,
      description,
      isSensitive,
    } = req.body;

    // Check for duplicate active request
    const duplicate = await ServiceRequest.findOne({
      building,
      room,
      category,
      serviceType,
      status: { $nin: ['Closed', 'Rejected'] },
    });

    if (duplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: 'An active request already exists for this issue',
        existingRequest: {
          requestId: duplicate.requestId,
          status: duplicate.status,
          supportCount: duplicate.supportCount,
          _id: duplicate._id,
        },
      });
    }

    // Create new request
    const newRequest = await ServiceRequest.create({
      studentId: req.user._id,
      category,
      serviceType,
      building,
      floor,
      room,
      description,
      isSensitive: isSensitive || false,
      image: req.file ? req.file.filename : '',
    });

    res.status(201).json({
      success: true,
      message: 'Service request raised successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Raise Request Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Support an existing request
// @route   PUT /api/student/support/:id
// @access  Private (Student)
const supportRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Check if sensitive request
    if (request.isSensitive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot support sensitive anonymous requests',
      });
    }

    // Check if user already supported
    if (request.supporters.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already supported this request',
      });
    }

    // Check if user is the creator
    if (request.studentId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot support your own request',
      });
    }

    // Add support
    request.supporters.push(req.user._id);
    request.supportCount = request.supporters.length;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request supported successfully',
      supportCount: request.supportCount,
    });
  } catch (error) {
    console.error('Support Request Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get student's own requests
// @route   GET /api/student/my-requests
// @access  Private (Student)
const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedStaff', 'name');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Get My Requests Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single request details
// @route   GET /api/student/request/:id
// @access  Private (Student)
const getRequestDetails = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('studentId', 'name')
      .populate('assignedStaff', 'name')
      .populate('supporters', 'name');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Hide reporter identity for sensitive requests
    let requestData = request.toObject();
    if (request.isSensitive) {
      requestData.studentId = { name: 'Anonymous' };
    }

    res.status(200).json({
      success: true,
      request: requestData,
    });
  } catch (error) {
    console.error('Get Request Details Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Verify completion and give rating
// @route   PUT /api/student/verify/:id
// @access  Private (Student)
const verifyCompletion = async (req, res) => {
  try {
    const { satisfied, rating, feedback } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'Waiting_Verification') {
      return res.status(400).json({
        success: false,
        message: 'Request is not awaiting verification',
      });
    }

    const latestAttempt = request.repairAttempts[request.repairAttempts.length - 1];

    if (satisfied) {
      request.status = 'Closed';
      request.completedAt = Date.now();
      request.rating = rating || 5;
      request.feedback = feedback || '';

      if (latestAttempt) {
        latestAttempt.status = 'Completed';
        latestAttempt.studentRating = rating || 5;
        latestAttempt.studentFeedback = feedback || '';
      }

      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Service marked as completed. Thank you for your feedback!',
      });
    } else {
      // Reopen request
      request.status = 'Reopened';

      if (latestAttempt) {
        latestAttempt.status = 'Student_Rejected';
        latestAttempt.studentRating = rating || 1;
        latestAttempt.studentFeedback = feedback || 'Issue not resolved';
      }

      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Request reopened. Staff will be reassigned.',
      });
    }
  } catch (error) {
    console.error('Verify Completion Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all active requests (for students to support)
// @route   GET /api/student/active-requests
// @access  Private (Student)
const getActiveRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      isSensitive: false,
      status: { $nin: ['Closed', 'Rejected', 'Draft'] },
    })
      .sort({ supportCount: -1, createdAt: -1 })
      .populate('studentId', 'name')
      .select('-supporters');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Get Active Requests Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  raiseRequest,
  supportRequest,
  getMyRequests,
  getRequestDetails,
  verifyCompletion,
  getActiveRequests,
};