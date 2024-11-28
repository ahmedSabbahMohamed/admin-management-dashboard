const { ApiLog } = require("../models");

const apiLogger = async (req, res, next) => {
  res.on("finish", async () => {
    try {
      await ApiLog.create({
        userId: req.user?._id || null,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (error) {
      console.log("Error logging API request:", error);
    }
  });
  next();
};

module.exports = apiLogger;
