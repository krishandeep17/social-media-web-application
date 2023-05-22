import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// @desc    Get Current User
// @route   GET /api/v1/users/me
// @access  Private
const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// @desc    Update Current User
// @route   PATCH /api/v1/users/updateMe
// @access  Private
const updateMe = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    gender,
    birthYear,
    birthMonth,
    birthDate,
    profilePicture,
    coverPicture,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      username,
      gender,
      birthYear,
      birthMonth,
      birthDate,
      profilePicture,
      coverPicture,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Update Current User Details
// @route   PATCH /api/v1/users/updateMyDetails
// @access  Private
const updateMyDetails = catchAsync(async (req, res, next) => {
  const {
    bio,
    job,
    workplace,
    highSchool,
    college,
    currentCity,
    homeTown,
    instagram,
    linkedin,
    twitter,
    relationship,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      details: {
        bio,
        job,
        workplace,
        highSchool,
        college,
        currentCity,
        homeTown,
        instagram,
        linkedin,
        twitter,
        relationship,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Delete Current User
// @route   DELETE /api/v1/users/me
// @access  Private
const deleteMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// @desc    Get All The Users
// @route   GET /api/v1/users
// @access  Admin
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// @desc    Create New User
// @route   POST /api/v1/users
// @access  Admin
const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Get User
// @route   GET /api/v1/users/:userId
// @access  Admin
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Update User
// @route   PATCH /api/v1/users/:userId
// @access  Admin
const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Delete User
// @route   DELETE /api/v1/users/:userId
// @access  Admin
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(204).json({
    status: "success",
    message: "User removed.",
  });
});

export {
  getMe,
  updateMe,
  updateMyDetails,
  deleteMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
