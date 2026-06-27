const mongoose = require('mongoose');

const repairAttemptSchema = new mongoose.Schema({
  attemptNumber: {
    type: Number,
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  beforeImage: {
    type: String,
    default: '',
  },
  afterImage: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['In_Progress', 'Completed', 'Student_Rejected'],
    default: 'In_Progress',
  },
  completedAt: Date,
  studentRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  studentFeedback: String,
});

const serviceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isSensitive: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Furniture',
        'Electrical',
        'Cleaning',
        'Internet',
        'Computer',
        'Projector',
        'Laboratory',
        'Water Supply',
        'Plumbing',
        'Transport',
        'Library',
        'Hostel',
        'Security',
        'Others',
      ],
    },
    serviceType: {
      type: String,
      required: [true, 'Please specify service type'],
      trim: true,
    },
    building: {
      type: String,
      required: [true, 'Please enter building name'],
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'Please enter floor number'],
    },
    room: {
      type: String,
      required: [true, 'Please enter room number'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the issue'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Submitted',
        'Verified',
        'Assigned',
        'In_Progress',
        'Waiting_Verification',
        'Completed',
        'Closed',
        'Reopened',
        'Rejected',
      ],
      default: 'Submitted',
    },
    deadline: Date,
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    supportCount: {
      type: Number,
      default: 0,
    },
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    repairAttempts: [repairAttemptSchema],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate requestId before saving
serviceRequestSchema.pre('save', async function () {
  if (this.isNew && !this.requestId) {
    const count = await mongoose.model('ServiceRequest').countDocuments();
    this.requestId = 'SR-' + String(count + 1).padStart(5, '0');
  }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);