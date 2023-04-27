import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "A post can't be empty"],
    trim: true,
    maxlength: [3000, "A post must have less than or equal to 3000 characters"],
  },
  images: [String],
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  like: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    trim: true,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
