import postModel from "../models/postModel.js";

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();
    console.log(req);
    return res.status(201).send({
      success: true,
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while posting",
      error,
    });
  }
};
//get all post

const getAllPostController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting posts",
      error,
    });
  }
};
//get user post
const getUserPostController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: "user posts",
      userPosts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in user post api",
      error,
    });
  }
};

// delete post

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
   return res.status(200).send({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in delete post api",
      error,
    });
  }
};
//update post 
const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    //post find
    const post = await postModel.findById({ _id: req.params.id });
    //validation
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please Provide post title or description",
      });
    }
    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in update post api",
      error,
    });
  }
};

export {
  createPostController,
  getAllPostController,
  getUserPostController,
  deletePostController,
  updatePostController
};
