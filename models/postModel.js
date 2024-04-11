import mongoose, { Schema } from "mongoose";


const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add your post title"],
  },
  description: {
    type: String,
    required: [true, "Please add your post description"],
  },
  postedBy:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  }
},{timestamps:true});

const postModel = mongoose.model('Post',postSchema);
export default postModel;