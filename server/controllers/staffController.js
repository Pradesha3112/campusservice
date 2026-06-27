const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Get staff's assigned requests
// @route   GET /api/staff/my-tasks
// @access  Private (Staff)
const getMyTasks = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      assignedStaff: req.user._id,
      status: { $nin: ['Closed', 'Rejected'] },
    })
      .sort({ priority: -1, createdAt: -1 })
      .populate('studentId', 'name registerNo');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Get My Tasks Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Upload before image and start work
// @route   PUT /api/staff/start-work/:id
// @access  Private (Staff)
const startWork = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.assignedStaff.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this request',
      });
    }

    const beforeImage = req.file ? req.file.filename : '';

    // Create new repair attempt
    const attemptNumber = request.repairAttempts.length + 1;

    request.repairAttempts.push({
      attemptNumber,
      staffId: req.user._id,
      beforeImage,
      status: 'In_Progress',
    });

    request.status = 'In_Progress';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Work started. Before image uploaded.',
      request,
    });
  } catch (error) {
    console.error('Start Work Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update progress
// @route   PUT /api/staff/update-progress/:id
// @access  Private (Staff)
const updateProgress = async (req, res) => {
  try {
    const { notes } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Progress note can be stored or just update status
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated',
      request,
    });
  } catch (error) {
    console.error('Update Progress Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Upload after image and complete work
// @route   PUT /api/staff/complete-work/:id
// @access  Private (Staff)
const completeWork = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.assignedStaff.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this request',
      });
    }

    const afterImage = req.file ? req.file.filename : '';

    // Update latest repair attempt
    const latestAttempt = request.repairAttempts[request.repairAttempts.length - 1];
    if (latestAttempt) {
      latestAttempt.afterImage = afterImage;
      latestAttempt.status = 'Completed';
      latestAttempt.completedAt = Date.now();
    }

    request.status = 'Waiting_Verification';
    await request.save();

    // Reduce staff load
    const staff = await User.findById(req.user._id);
    if (staff.currentLoad > 0) {
      staff.currentLoad -= 1;
      staff.availability = true;
      await staff.save();
    }

    res.status(200).json({
      success: true,
      message: 'Work completed. Waiting for student verification.',
      request,
    });
  } catch (error) {
    console.error('Complete Work Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get request details
// @route   GET /api/staff/request/:id
// @access  Private (Staff)
const getRequestDetails = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('studentId', 'name registerNo')
      .populate('assignedStaff', 'name');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.status(200).json({
      success: true,
      request,
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

// @desc    Get staff profile
// @route   GET /api/staff/profile
// @access  Private (Staff)
const getProfile = async (req, res) => {
  try {
    const staff = await User.findById(req.user._id).select('-password');

    // Get stats
    const completedCount = await ServiceRequest.countDocuments({
      assignedStaff: req.user._id,
      status: { $in: ['Completed', 'Closed'] },
    });

    const activeCount = await ServiceRequest.countDocuments({
      assignedStaff: req.user._id,
      status: { $nin: ['Closed', 'Rejected', 'Completed'] },
    });

    res.status(200).json({
      success: true,
      profile: staff,
      stats: {
        completed: completedCount,
        active: activeCount,
      },
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getMyTasks,
  startWork,
  updateProgress,
  completeWork,
  getRequestDetails,
  getProfile,
};