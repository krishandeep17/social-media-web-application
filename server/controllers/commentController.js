import Comment from "../models/commentModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// @desc    Get All Comments On Post OR Get All The Comments
// @route   GET /api/v1/posts/:postId/comments OR GET /api/v1/comments
// @access  Private
const getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId };

  const comments = await Comment.find(filter);

  res.status(200).json({
    status: "success",
    result: comments.length,
    data: {
      comments,
    },
  });
});

// @desc    Create Comment On Post OR Create Comment
// @route   POST /api/v1/posts/:postId/comments OR /api/v1/comments
// @access  Private
const createComment = catchAsync(async (req, res, next) => {
  const { comment, image, post, user } = req.body;

  const newComment = await Comment.create({ comment, image, post, user });

  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

// @desc    Get Comment
// @route   GET /api/v1/comments/:commentId
// @access  Admin
const getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("Comment not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

// @desc    Update Comment
// @route   PATCH /api/v1/comments/:commentId
// @access  Admin
const updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) {
    return next(new AppError("Comment not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

// @desc    Delete Comment
// @route   DELETE /api/v1/comments/:commentId
// @access  Admin
const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError("Comment not found.", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Comment removed",
  });
});

export {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
};
