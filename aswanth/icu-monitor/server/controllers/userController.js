const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('assignedPatients', 'name patientId');
  res.json(users);
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  if (req.body.password) delete req.body.password; // password changes via separate flow
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
});

exports.deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ message: 'User deactivated', user });
});