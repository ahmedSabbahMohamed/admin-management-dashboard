const { User, LoginLog, ApiLog } = require("../models");
const { asyncHandler } = require("../middlewares");
const { httpStatusText } = require("../utils");

exports.getUserRegisterationTrends = asyncHandler(async (req, res, next) => {
  const trends = await User.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date ascending
  ]);

  res.status(200).json(trends);
});

exports.getUserStatusDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await User.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(distribution);
});

exports.getRoleDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(distribution);
});

exports.getLoginMetrics = asyncHandler(async (req, res, next) => {
  const totalLogins = await LoginLog.countDocuments();
  const failedLogins = await LoginLog.countDocuments({ status: "failure" });
  const successfulLogins = await LoginLog.countDocuments({ status: "success" });

  // Group logins by day (last 7 days)
  const loginsByDay = await LoginLog.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: 1 },
        successful: {
          $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] },
        },
        failed: { $sum: { $cond: [{ $eq: ["$status", "failure"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);

  res.json({
    status: httpStatusText.SUCCESS,
    data: { totalLogins, failedLogins, successfulLogins, loginsByDay },
  });
});

exports.getApiMetrics = asyncHandler(async (req, res, next) => {
  const totalRequests = await ApiLog.countDocuments();

  const requestsByEndpoint = await ApiLog.aggregate([
    {
      $group: {
        _id: "$endpoint",
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  const requestsByMethod = await ApiLog.aggregate([
    {
      $group: {
        _id: "$method",
        total: { $sum: 1 },
      },
    },
  ]);

  const requestsByStatus = await ApiLog.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: 1 },
      },
    },
  ]);

  const requestsByDay = await ApiLog.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      totalRequests,
      requestsByEndpoint,
      requestsByMethod,
      requestsByStatus,
      requestsByDay,
    },
  });
});
