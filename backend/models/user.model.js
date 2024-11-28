const mongoose = require("mongoose");
const roles = require("../utils/roles");
const { hashPassword, comparePassword } = require("../utils/autUtils");

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      required: false,
      default: "public/images/avatar.png",
    },
    first_name: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minLength: [3, "First Name must be at least 3 characters long"],
    },
    last_name: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minLength: [3, "First Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: [roles.ADMIN, roles.EDITOR, roles.VIEWER],
      default: roles.VIEWER,
    },
    status: {
      type: String,
      enum: [roles.STATUS.ACTIVE, roles.STATUS.INACTIVE],
      default: roles.STATUS.ACTIVE,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return comparePassword(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
