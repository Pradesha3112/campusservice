const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

const raiseRequest = async (req, res) => {
  try {
    const { category, serviceType, building, floor, room, description, isSensitive } = req.body;
    const duplicate = await ServiceRequest.findOne({
      building, room, category, serviceType,
      status: { $nin: ['Closed', 'Rejected'] },
    });
    if (duplicate) {
      return res.status(200).json({
        success: true, isDuplicate: true,
        message: 'An active request already exists for this issue',
        existingRequest: { requestId: duplicate.requestId, status: duplicate.status, supportCount: duplicate.supportCount, _id: duplicate._id },
      });
    }
    const newRequest = await ServiceRequest.create({
      studentId: req.user._id, category, serviceType, building, floor, room, description,
      isSensitive: isSensitive || false, image: req.file ? req.file.filename : '',
    });
    res.status(201).json({ success: true, message: 'Service request raised successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const supportRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.isSensitive) return res.status(400).json({ success: false, message: 'Cannot support sensitive anonymous requests' });
    if (request.supporters.includes(req.user._id)) return res.status(400).json({ success: false, message: 'You have already supported this request' });
    if (request.studentId.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'You cannot support your own request' });
    request.supporters.push(req.user._id);
    request.supportCount = request.supporters.length;
    await request.save();
    res.status(200).json({ success: true, message: 'Request supported successfully', supportCount: request.supportCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ studentId: req.user._id }).sort({ createdAt: -1 }).populate('assignedStaff', 'name');
    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getRequestDetails = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id).populate('studentId', 'name').populate('assignedStaff', 'name').populate('supporters', 'name');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    let requestData = request.toObject();
    if (request.isSensitive) requestData.studentId = { name: 'Anonymous' };
    res.status(200).json({ success: true, request: requestData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const verifyCompletion = async (req, res) => {
  try {
    const { satisfied, rating, feedback } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'Waiting_Verification') return res.status(400).json({ success: false, message: 'Request is not awaiting verification' });
    const latestAttempt = request.repairAttempts[request.repairAttempts.length - 1];
    if (satisfied) {
      request.status = 'Closed';
      request.completedAt = Date.now();
      request.rating = rating || 5;
      request.feedback = feedback || '';
      if (latestAttempt) { latestAttempt.status = 'Completed'; latestAttempt.studentRating = rating || 5; latestAttempt.studentFeedback = feedback || ''; }
      await request.save();
      return res.status(200).json({ success: true, message: 'Service marked as completed. Thank you!' });
    } else {
      request.status = 'Reopened';
      if (latestAttempt) { latestAttempt.status = 'Student_Rejected'; latestAttempt.studentRating = rating || 1; latestAttempt.studentFeedback = feedback || 'Issue not resolved'; }
      await request.save();
      return res.status(200).json({ success: true, message: 'Request reopened. Staff will be reassigned.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getActiveRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ isSensitive: false, status: { $nin: ['Closed', 'Rejected', 'Draft'] } }).sort({ supportCount: -1, createdAt: -1 }).populate('studentId', 'name').select('-supporters');
    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (phone) user.phone = phone;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { raiseRequest, supportRequest, getMyRequests, getRequestDetails, verifyCompletion, getActiveRequests, updateProfile };