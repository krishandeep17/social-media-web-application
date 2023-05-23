import { cloudinary, upload } from "../utils/multerCloudinary.js";

// Get Image File
const getSingleImage = upload.single("image");

// Upload Comment Image
const uploadCommentImage = (req, res, next) => {
  if (!req.file) return next();

  // Upload Image To Cloudinary
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

// Middleware to set PostID and UserID fields
const setPostUserId = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;

  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export { getSingleImage, uploadCommentImage, setPostUserId };
