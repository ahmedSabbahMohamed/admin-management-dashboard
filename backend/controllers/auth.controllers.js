const { User } = require("../models");
const { asyncHandler } = require("../middlewares");
const { createError, httpStatusText, logLoginAttempt } = require("../utils");

exports.register = asyncHandler(async (req, res, next) => {
  const { email, ...data } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(createError("User already exists", 400, httpStatusText.FAIL));
  }

  const newUser = await User.create({ email, ...data });
  const token = await generateJWT(data);

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "User created successfully",
    data: { user: newUser, access_token: token },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isPasswordValid = await user.comparePassword(password);

  if (!user || !isPasswordValid) {
    await logLoginAttempt.logLoginAttempt(
      null,
      "failure",
      req.ip,
      req.headers["user-agent"]
    );
    return next(createError("Invalid credentials", 401, httpStatusText.FAIL));
  }

  const token = await generateJWT({ email, role: user.role });
  await logLoginAttempt(user._id, "success", req.ip, req.headers["user-agent"]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User logged in successfully",
    data: { user, access_token: token },
  });
});
