const Task = require('../models/Task');
const mongoose = require('mongoose');
const Submission = require('../models/Submission');

// @desc  Get all available (Open) tasks
// @route GET /api/talent/tasks/available
// @access Talent
const getAvailableTasks = async (req, res) => {
  try {
    // (loose schema allows this inconsistent state from seed data)
    const tasks = await Task.find({ status: 'Open' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks assigned to the logged-in talent
// @route GET /api/talent/tasks/mine
// @access Talent
const getMyTasks = async (req, res) => {
  try {
    // all come back mixed together with no grouping
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ updatedAt: -1 });

    const submissions = await Submission.find({
      talentId: req.user._id,
      taskId: { $in: tasks.map((task) => task._id) },
    }).select('taskId reviewStatus');

    const reviewStatusByTask = submissions.reduce((acc, submission) => {
      acc[submission.taskId.toString()] = submission.reviewStatus;
      return acc;
    }, {});

    res.json(tasks.map((task) => ({
      ...task.toObject(),
      submissionReviewStatus: reviewStatusByTask[task._id.toString()],
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Claim an open task
// @route PUT /api/talent/tasks/:id/claim
// @access Talent
const claimTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, status: 'Open' },
      {
        status: 'Claimed',
        assignedTo: req.user._id,
      },
      { new: true }
    );

    if (task) {
      return res.json(task);
    }

    const taskExists = await Task.exists({ _id: req.params.id });
    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(400).json({ message: 'Task is no longer available' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableTasks, getMyTasks, claimTask };
