const createHttpError = require("http-errors");
const { httpStatusText } = require(".");

const createError = (message, statusCode, statusText) => {
  const error = createHttpError(statusCode, message);
  error.statusText = statusText || httpStatusText.ERROR;
  return error;
};

module.exports = createError;
