const mongoose = require('mongoose');
//   multiple times for the same task (no duplicate prevention)
const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fileUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
    reviewStatus: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected', 'Revision Requested'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
