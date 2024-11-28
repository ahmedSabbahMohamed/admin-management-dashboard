const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { apiLogger, errorHandler } = require("./middlewares");
const { httpStatusText, createError } = require("./utils");
const { auth, user, metrics } = require("./routes");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(apiLogger);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/metrics", metrics);

app.all("*", (req, res, next) => {
  next(createError("Not Found", 404, httpStatusText.ERROR));
});

app.use(errorHandler);

module.exports = app;
