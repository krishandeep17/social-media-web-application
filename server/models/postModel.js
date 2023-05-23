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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

// Virtual Populate React
postSchema.virtual("reacts", {
  ref: "React",
  foreignField: "post",
  localField: "_id",
});

// Virtual Populate Comment
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("Post", postSchema);

export default Post;
