const { User } = require("../models");
const { asyncHandler } = require("../middlewares");
const { httpStatusText, createError } = require("../utils");

exports.createUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(createError("User already exists", 400, httpStatusText.FAIL));
  }

  const newUser = await User.create(req.body);
  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "User created successfully",
    data: { user: newUser },
  });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const total = await User.countDocuments();

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Users fetched successfully",
    data: { page, limit, total, users },
  });
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User fetched successfully",
    data: { user },
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User updated successfully",
    data: { user },
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User deleted successfully",
    data: null,
  });
});
