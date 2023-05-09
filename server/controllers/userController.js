import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// For users
const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const updateMe = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    avatar,
    coverPhoto,
    gender,
    birthYear,
    birthMonth,
    birthDate,
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
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      username,
      avatar,
      coverPhoto,
      gender,
      birthYear,
      birthMonth,
      birthDate,
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
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// For admin
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

const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user find with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
