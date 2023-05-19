import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      maxlength: [
        3000,
        "A post must have less than or equal to 3000 characters",
      ],
    },
    image: String,
    background: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        comment: { type: String, trim: true },
        image: String,
        commentBy: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        commentedAt: { type: Date, default: new Date() },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
