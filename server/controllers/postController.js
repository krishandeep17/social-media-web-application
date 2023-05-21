import Post from "../models/postModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// @desc    Get All The Posts
// @route   GET /api/v1/posts
// @access  Private
const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  // .sort({ createdAt: -1 });
  // .populate("user", "firstName lastName username profilePicture gender")

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

// @desc    Create New Post
// @route   POST /api/v1/posts
// @access  Private
const createPost = catchAsync(async (req, res, next) => {
  const { text, image } = req.body;

  const user = req.user.id;

  const post = await Post.create({
    text,
    image,
    user,
  });

  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

// @desc    Get Post
// @route   GET /api/v1/posts/:postId
// @access  Private
const getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("reacts");

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
      // reacts: post.reacts,
    },
  });
});

// @desc    Update Post
// @route   PATCH /api/v1/posts/:postId
// @access  Private
const updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;

  const post = await Post.findByIdAndUpdate(
    id,
    { text },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

// @desc    Delete Post
// @route   DELETE /api/v1/posts/:postId
// @access  Private
const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(204).json({ status: "success", data: null });
});

// @desc    Comment On Post
// @route   PATCH /api/v1/posts/:postId/comment
// @access  Private
// const commentOnPost = catchAsync(async (req, res, next) => {
//   const postId = req.params.id;
//   const { comment, image } = req.body;
//   const commentBy = req.user.id;

//   const post = await Post.findByIdAndUpdate(
//     postId,
//     {
//       $push: { comments: { comment, image, commentBy } },
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   ).populate(
//     "comments.commentBy",
//     "firstName lastName username profilePicture"
//   );

//   if (!post) {
//     return next(new AppError("No post find with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       comments: post.comments,
//     },
//   });
// });

export {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  // commentOnPost,
};
