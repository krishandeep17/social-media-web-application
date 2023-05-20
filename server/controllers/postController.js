import Post from "../models/postModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { cloudinary, upload } from "../utils/multerCloudinary.js";

// @desc    Get All The Posts
// @route   GET /api/v1/posts
// @access  Private
const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate("user", "firstName lastName username profilePicture gender")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

const getSingleImage = upload.single("image");

const uploadPostImages = (req, res, next) => {
  if (!req.file) return next();

  // Upload file to Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        folder: `FriendsPlace/${req.user.id}/post_images`,
        transformation: [
          { effect: "improve", width: 1200, height: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError("An error occurred during image upload.", 500)
          );
        }

        // Pass the uploaded image URL to req.body.image
        req.body.image = result.secure_url;

        next();
      }
    )
    .end(req.file.buffer);
};

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

const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(204).json({ status: "success", data: null });
});

const uploadCommentImage = (req, res, next) => {
  if (!req.file) return next();

  // Upload file to Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        folder: `FriendsPlace/${req.user.id}/post_images/${req.params.id}/comment_images`,
        transformation: [
          { effect: "improve", width: 1200, height: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError(
              "An error occurred during image upload in comment.",
              500
            )
          );
        }

        // Pass the uploaded image URL to req.body.image
        req.body.image = result.secure_url;

        next();
      }
    )
    .end(req.file.buffer);
};

const commentOnPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { comment, image } = req.body;
  const commentBy = req.user.id;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: { comment, image, commentBy } },
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "comments.commentBy",
    "firstName lastName username profilePicture"
  );

  if (!post) {
    return next(new AppError("No post find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      comments: post.comments,
    },
  });
});

export {
  getAllPosts,
  getSingleImage,
  uploadPostImages,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadCommentImage,
  commentOnPost,
};
