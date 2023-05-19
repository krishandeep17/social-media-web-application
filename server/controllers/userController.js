import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { cloudinary, upload } from "../utils/multerCloudinary.js";

// For users
const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const getUserImages = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 },
]);

const uploadProfilePhoto = (req, res, next) => {
  if (!req.files.profilePhoto) return next();

  // Upload file to Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "auto",
        folder: `FriendsPlace/${req.user.id}/profilePhoto`,
        transformation: [
          { effect: "improve", width: 320, height: 320, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError("An error occurred during profile photo upload.", 500)
          );
        }

        // Pass the uploaded image URL to req.body.profilePhoto
        req.body.profilePhoto = result.secure_url;

        next();
      }
    )
    .end(req.files.profilePhoto[0].buffer);
};

const uploadCoverPhoto = async (req, res, next) => {
  if (!req.files.coverPhoto) return next();

  // Upload file to Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "auto",
        folder: `FriendsPlace/${req.user.id}/coverPhoto`,
        transformation: [
          { effect: "improve", width: 851, height: 315, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError("An error occurred during cover photo upload.", 500)
          );
        }

        // Pass the uploaded image URL to req.body.coverPhoto
        req.body.coverPhoto = result.secure_url;

        next();
      }
    )
    .end(req.files.coverPhoto[0].buffer);
};

const updateMe = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    gender,
    birthYear,
    birthMonth,
    birthDate,
    profilePhoto,
    coverPhoto,
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
      profilePhoto,
      coverPhoto,
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
  getUserImages,
  uploadProfilePhoto,
  uploadCoverPhoto,
  updateMe,
  updateMyDetails,
  deleteMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
