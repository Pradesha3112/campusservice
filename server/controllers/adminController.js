const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Get all requests (with filters)
// @route   GET /api/admin/requests
// @access  Private (Admin)
const getAllRequests = async (req, res) => {
  try {
    const { status, category, priority, building, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (building) query.building = building;

    if (search) {
      query.$or = [
        { requestId: { $regex: search, $options: 'i' } },
        { room: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email registerNo')
      .populate('assignedStaff', 'name');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Get All Requests Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Verify a request (approve)
// @route   PUT /api/admin/verify/:id
// @access  Private (Admin)
const verifyRequest = async (req, res) => {
  try {
    const { priority, deadline } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: 'Request can only be verified when status is Submitted',
      });
    }

    request.status = 'Verified';
    request.priority = priority || 'Medium';

    if (deadline) {
      request.deadline = new Date(deadline);
    } else {
      // Auto-set deadline based on priority
      const days = priority === 'High' ? 0 : priority === 'Medium' ? 1 : 3;
      const hours = priority === 'High' ? 4 : 0;
      const dl = new Date();
      dl.setDate(dl.getDate() + days);
      if (hours) dl.setHours(dl.getHours() + hours);
      request.deadline = dl;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request verified successfully',
      request,
    });
  } catch (error) {
    console.error('Verify Request Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Reject a request
// @route   PUT /api/admin/reject/:id
// @access  Private (Admin)
const rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'Rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request,
    });
  } catch (error) {
    console.error('Reject Request Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Assign staff to a request
// @route   PUT /api/admin/assign/:id
// @access  Private (Admin)
const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    const request = await ServiceRequest.findById(req.params.id);
    const staff = await User.findById(staffId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (!staff || staff.role !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Invalid staff member',
      });
    }

    // Check staff capacity
    if (staff.currentLoad >= staff.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Staff member has reached maximum capacity',
      });
    }

    // Check if already assigned
    if (request.assignedStaff) {
      return res.status(400).json({
        success: false,
        message: 'Request already assigned to a staff member',
      });
    }

    request.assignedStaff = staffId;
    request.status = 'Assigned';

    // Increment staff load
    staff.currentLoad += 1;
    if (staff.currentLoad >= staff.capacity) {
      staff.availability = false;
    }

    await request.save();
    await staff.save();

    res.status(200).json({
      success: true,
      message: 'Staff assigned successfully',
      request,
    });
  } catch (error) {
    console.error('Assign Staff Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all staff members
// @route   GET /api/admin/staff
// @access  Private (Admin)
const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');

    res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error('Get All Staff Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create staff account
// @route   POST /api/admin/create-staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
  try {
    const { name, email, password, department, phone, capacity } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const staff = await User.create({
      name,
      email,
      password,
      department,
      phone,
      role: 'staff',
      capacity: capacity || 5,
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        capacity: staff.capacity,
      },
    });
  } catch (error) {
    console.error('Create Staff Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments();
    const pendingRequests = await ServiceRequest.countDocuments({
      status: { $in: ['Submitted', 'Verified', 'Assigned', 'In_Progress'] },
    });
    const completedRequests = await ServiceRequest.countDocuments({
      status: { $in: ['Completed', 'Closed'] },
    });
    const rejectedRequests = await ServiceRequest.countDocuments({
      status: 'Rejected',
    });
    const reopenedRequests = await ServiceRequest.countDocuments({
      status: 'Reopened',
    });

    // Category-wise count
    const categoryWise = await ServiceRequest.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Staff workload
    const staffWorkload = await User.find({ role: 'staff' }).select('name currentLoad capacity availability');

    // Recent requests
    const recentRequests = await ServiceRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name')
      .populate('assignedStaff', 'name');

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingRequests,
        completedRequests,
        rejectedRequests,
        reopenedRequests,
        categoryWise,
        staffWorkload,
        recentRequests,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.status(200).json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


module.exports = {
  getAllRequests,
  verifyRequest,
  rejectRequest,
  assignStaff,
  getAllStaff,
  getAllUsers,
  createStaff,
  getDashboardStats,
  deleteStaff,
};