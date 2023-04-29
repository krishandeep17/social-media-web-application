import Post from "../models/postModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  // const { description, photo, like } = req.body;

  const post = await Post.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

const getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

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

const updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // const { description, photo, like } = req.body;

  const post = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

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

const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(204).json({ status: "success", data: null });
});

export { getAllPosts, createPost, getPost, updatePost, deletePost };
