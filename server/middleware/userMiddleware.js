import { cloudinary, upload } from "../utils/multerCloudinary.js";

// Get Image Files
const multerUploadImage = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "coverPicture", maxCount: 1 },
]);

// Upload Profile Picture
const uploadProfilePicture = (req, res, next) => {
  if (!req.files.profilePicture) return next();

  // Upload Image To Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        folder: `FriendsPlace/${req.user.id}/profile_pictures`,
        transformation: [
          { effect: "improve", width: 320, height: 320, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError(
              "An error occurred during profile picture upload.",
              500
            )
          );
        }

        // Pass the uploaded image URL to req.body.profilePicture
        req.body.profilePicture = result.secure_url;

        next();
      }
    )
    .end(req.files.profilePicture[0].buffer);
};

// Upload Cover Picture
const uploadCoverPicture = (req, res, next) => {
  if (!req.files.coverPicture) return next();

  // Upload Image To Cloudinary
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        folder: `FriendsPlace/${req.user.id}/cover_pictures`,
        transformation: [
          { effect: "improve", width: 851, height: 315, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return next(
            new AppError("An error occurred during cover picture upload.", 500)
          );
        }

        // Pass the uploaded image URL to req.body.coverPicture
        req.body.coverPicture = result.secure_url;

        next();
      }
    )
    .end(req.files.coverPicture[0].buffer);
};

export { multerUploadImage, uploadProfilePicture, uploadCoverPicture };
