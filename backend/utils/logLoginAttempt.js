const { LoginLog } = require("../models");

const logLoginAttempt = async (userId, status, ip, userAgent) => {
  try {
    await LoginLog.create({
      userId,
      status,
      ip,
      userAgent,
    });
  } catch (error) {
    console.error("Error logging login attempt:", error);
  }
};

module.exports = logLoginAttempt;
