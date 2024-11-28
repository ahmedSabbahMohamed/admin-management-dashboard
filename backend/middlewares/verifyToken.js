const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return next(createError(401, "Access denied"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = currentUser;
    next();
  } catch (error) {
    return next(createError(403, "Invalid token"));
  }
};

module.exports = verifyToken;
