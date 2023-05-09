import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please tell us your first name"],
      trim: true,
      validate: [
        validator.isAlpha,
        "First name must contain only alphabetic characters",
      ],
      minlength: [3, "First name must contain at least 3 characters"],
      maxlength: [30, "First name must not exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please tell us your last name"],
      trim: true,
      validate: [
        validator.isAlpha,
        "Last name must contain only alphabetic characters",
      ],
      minlength: [3, "Last name must contain at least 3 characters"],
      maxlength: [30, "Last name must not exceed 30 characters"],
    },
    username: {
      type: String,
      required: [true, "Please provide your username"],
      trim: true,
      validate: [
        validator.isAlpha,
        "Username must contain only alphabetic characters",
      ],
      minlength: [3, "Username must contain at least 3 characters"],
      maxlength: [30, "Username must not exceed 30 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },
    passwordChangeAt: {
      type: Date,
      default: new Date(),
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    coverPhoto: String,
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: ["male", "female"],
    },
    birthYear: {
      type: Number,
      required: [true, "Please provide a birth year"],
    },
    birthMonth: {
      type: Number,
      required: [true, "Please provide a birth month"],
    },
    birthDate: {
      type: Number,
      required: [true, "Please provide a birth day"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    details: {
      bio: String,
      job: String,
      workplace: String,
      highSchool: String,
      college: String,
      currentCity: String,
      homeTown: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      relationship: {
        type: String,
        enum: ["single", "in a relationship", "married", "divorced"],
      },
    },
    savedPosts: [
      {
        post: {
          type: mongoose.Schema.ObjectId,
          ref: "Post",
        },
        savedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
