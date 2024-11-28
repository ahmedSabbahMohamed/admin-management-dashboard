const { createError, httpStatusText } = require("../utils");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          "You are not authorized to perform this action",
          403,
          httpStatusText.FAIL
        )
      );
    }
    return next();
  };
};
