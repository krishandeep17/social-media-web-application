import mongoose from "mongoose";

const reactSchema = new mongoose.Schema(
  {
    react: {
      type: String,
      enum: ["like", "love", "haha", "sad", "angry", "wow"],
      required: [true, "React can not be empty!"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "React must be belong to a post."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "React must be belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reactSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName username profilePicture",
  });
  next();
});

const React = mongoose.model("React", reactSchema);

export default React;
