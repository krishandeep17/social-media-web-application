import Post from "../models/postModel.js";

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

const createPost = async (req, res) => {
  try {
    // const { description, photo, like } = req.body;

    const post = await Post.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    // const { description, photo, like } = req.body;

    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

export { getAllPosts, createPost, getPost, updatePost, deletePost };
