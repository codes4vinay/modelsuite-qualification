const Task = require('../models/Task');

const mongoose = require('mongoose');
const User = require('../models/User');

const validateAssignedTalent = async (assignedTo) => {
  if (!assignedTo) {
    return { assignedTo: null };
  }

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    return { error: 'Invalid assigned user' };
  }

  const user = await User.findById(assignedTo);
  if (!user) {
    return { error: 'Assigned user not found' };
  }

  if (user.role !== 'Talent') {
    return { error: 'Tasks can only be assigned to Talent users' };
  }

  return { assignedTo };
};

// @desc  Get all tasks
// @route GET /api/tasks
// @access Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single task
// @route GET /api/tasks/:id
// @access Admin
const getTaskById = async (req, res) => {
  try {
    // — will throw a CastError from Mongoose instead of a clean 400
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a task
// @route POST /api/tasks
// @access Admin
const createTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;

  try {
    const assignment = await validateAssignedTalent(assignedTo);
    if (assignment.error) {
      return res.status(400).json({ message: assignment.error });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assignment.assignedTo,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updateData = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(updateData, 'assignedTo')) {
      const assignment = await validateAssignedTalent(updateData.assignedTo);
      if (assignment.error) {
        return res.status(400).json({ message: assignment.error });
      }
      updateData.assignedTo = assignment.assignedTo;
    }

    // including internal fields like createdBy or __v
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // — orphaned Submission documents remain in DB after task deletion
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
