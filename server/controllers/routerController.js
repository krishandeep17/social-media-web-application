import React from "../models/reactModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// @desc    Get All Reacts On Post
// @route   GET /api/v1/posts/:postId/reacts
// @access  Private
const getAllPostReacts = catchAsync(async (req, res, next) => {
  const reacts = await React.find({ post: req.params.postId });

  res.status(200).json({
    status: "success",
    result: reacts.length,
    data: {
      reacts,
    },
  });
});

// @desc    Create, Update Or Delete React On Post
// @route   POST /api/v1/posts/:postId/reacts
// @access  Private
const createPostReact = catchAsync(async (req, res, next) => {
  const { react } = req.body;
  const post = req.params.postId;
  const user = req.user.id;

  const alreadyReact = await React.findOne({ post, user });

  if (!alreadyReact) {
    const newReact = await React.create({ react, post, user });

    res.status(201).json({
      status: "success",
      data: {
        react: newReact,
      },
    });
  } else {
    if (alreadyReact.react === react) {
      await React.findByIdAndRemove(alreadyReact._id);

      res.status(204).json({ status: "success", data: null });
    } else {
      const updateReact = await React.findByIdAndUpdate(
        alreadyReact._id,
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

// @desc    Get All The Reacts
// @route   GET /api/v1/reacts
// @access  Admin
const getAllReacts = catchAsync(async (req, res, next) => {
  const reacts = await React.find();

  res.status(200).json({
    status: "success",
    results: reacts.length,
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
    return next(new AppError("React not found.", 404));
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
    return next(new AppError("React not found.", 404));
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
    return next(new AppError("React not found.", 404));
  }

  res.status(204).json({
    status: "success",
    message: "React removed",
  });
});

export {
  getAllPostReacts,
  createPostReact,
  getAllReacts,
  createReact,
  getReact,
  updateReact,
  deleteReact,
};
