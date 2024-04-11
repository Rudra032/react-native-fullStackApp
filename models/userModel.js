import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add email"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add password"],
    trim: true,
    min: 6,
    max: 64,
  },
  role:{
    type: String,
    default: "user",
  },
},
{timestamps: true}
);

const userModel = mongoose.model("User", userSchema);

export default userModel;