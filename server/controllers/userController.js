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

// @desc    User Save Post
// @route   PATCH /api/v1/users/savePost/:postId
// @access  Private
const savePost = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { savedPosts: { post: req.params.postId } },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("savedPosts.post");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      savedPosts: user.savedPosts,
    },
  });
});

// @desc    Send Or Cancel Friend Request
// @route   PATCH /api/v1/users/sendFriendRequest/:receiverId
// @access  Private
const sendFriendRequest = catchAsync(async (req, res, next) => {
  const receiver = await User.findById(req.params.receiverId);
  const sender = await User.findById(req.user.id);

  // Check if the sender is already receiver's friend
  if (receiver.friends.includes(sender._id)) {
    return next(new AppError("You are already friend of him/her.", 400));
  }

  // Check if the user already send friend request and then cancel the request
  if (receiver.requests.includes(sender._id)) {
    await receiver.updateOne({
      $pull: { requests: sender._id },
    });

    res.status(200).json({
      status: "success",
      message: "Friend request cancel successfully.",
    });
  } else {
    await receiver.updateOne({
      $push: { requests: sender._id },
    });

    res.status(200).json({
      status: "success",
      message: "Friend request send successfully.",
    });
  }
});

// @desc    Accept Friend Request
// @route   PATCH /api/v1/users/acceptFriendRequest/:senderId
// @access  Private
const acceptFriendRequest = catchAsync(async (req, res, next) => {
  const sender = await User.findById(req.params.senderId);
  const receiver = await User.findById(req.user.id);

  // Check if the user already receiver's friend
  if (receiver.friends.includes(sender._id)) {
    return next(new AppError("You are already friend of him/her.", 400));
  }

  // Check if the user receive friend request
  if (!receiver.requests.includes(sender._id)) {
    return next(new AppError("Friend request not found.", 400));
  }

  await receiver.updateOne({
    $pull: { requests: sender._id },
    $push: { friends: sender._id },
  });

  await sender.updateOne({
    $push: { friends: receiver._id },
  });

  res.status(200).json({
    status: "success",
    message: "Friend request accepted.",
  });
});

// @desc    Delete Friend Request
// @route   PATCH /api/v1/users/deleteFriendRequest/:senderId
// @access  Private
const deleteFriendRequest = catchAsync(async (req, res, next) => {
  const sender = await User.findById(req.params.senderId);
  const receiver = await User.findById(req.user.id);

  // Check if the user already receiver's friend
  if (receiver.friends.includes(sender._id)) {
    return next(new AppError("You are already friend of him/her.", 400));
  }

  // Check if the user receive friend request
  if (!receiver.requests.includes(sender._id)) {
    return next(new AppError("Friend request not found.", 400));
  }

  await receiver.updateOne({
    $pull: { requests: sender._id },
  });

  res.status(200).json({
    status: "success",
    message: "Friend request deleted.",
  });
});

// @desc    Remove User's Friend
// @route   PATCH /api/v1/users/removeFriend/:friendId
// @access  Private
const removeFriend = catchAsync(async (req, res, next) => {
  const friend = await User.findById(req.params.friendId);
  const user = await User.findById(req.user.id);

  // Check if the user has that friend
  if (!user.friends.includes(friend._id)) {
    return next(new AppError("You are not friend of him/her.", 400));
  }

  await user.updateOne({
    $pull: { friends: friend._id },
  });

  await friend.updateOne({
    $pull: { friends: user._id },
  });

  res.status(200).json({
    status: "success",
    message: "You are not friends anymore.",
  });
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
  savePost,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
