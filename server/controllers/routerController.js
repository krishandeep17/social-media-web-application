import React from "../models/reactModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// @desc    React On Post
// @route   PATCH /api/v1/reacts/postId
// @access  Private
const reactPost = catchAsync(async (req, res, next) => {
  const { react } = req.body;
  const post = req.params.postId;
  const user = req.user.id;

  const checkReact = await React.findOne({ post, user });

  if (!checkReact) {
    const newReact = await React.create({ react, post, user });

    res.status(201).json({
      status: "success",
      data: {
        react: newReact,
      },
    });
  } else {
    if (checkReact.react === react) {
      await React.findByIdAndRemove(checkReact._id);

      res.status(204).json({ status: "success", data: null });
    } else {
      const updateReact = await React.findByIdAndUpdate(
        react._id,
        { react },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "success",
        data: {
          react: updateReact,
        },
      });
    }
  }
});

// @desc    Get All Reacts
// @route   GET /api/v1/reacts
// @access  Private
const getAllReacts = catchAsync(async (req, res, next) => {
  const reacts = await React.find();

  res.status(200).json({
    status: "success",
    result: reacts.length,
    data: {
      reacts,
    },
  });
});

// @desc    Create New React
// @route   POST /api/v1/reacts
// @access  Admin
const createReact = catchAsync(async (req, res, next) => {
  const react = await React.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      react,
    },
  });
});

// @desc    Get React
// @route   GET /api/v1/reacts/:reactId
// @access  Admin
const getReact = catchAsync(async (req, res, next) => {
  const react = await React.findById(req.params.id);

  if (!react) {
    return next(new AppError("No react find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      react,
    },
  });
});

// @desc    Update React
// @route   PATCH /api/v1/reacts/:reactId
// @access  Admin
const updateReact = catchAsync(async (req, res, next) => {
  const react = await React.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!react) {
    return next(new AppError("No react find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      react,
    },
  });
});

// @desc    Delete React
// @route   DELETE /api/v1/reacts/:reactId
// @access  Admin
const deleteReact = catchAsync(async (req, res, next) => {
  const react = await React.findByIdAndDelete(req.params.id);

  if (!react) {
    return next(new AppError("No react find with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export { reactPost, getAllReacts, createReact };
