import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { expressjwt } from "express-jwt";
import dotenv from "dotenv";
dotenv.config();
//middleware

const requireSignIn = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
// console.log(process.env.JWT_SECRET)
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
        return res.status(400).send({
        success: false,
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password is required and 6 character long",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered with this email",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "Registration Successfull Please Login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registration API",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Enter Email Or Password",
      });
    }
    //find User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }

    //match password

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid User Name Or Password",
      });
    }
    //jwt token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //password undefined
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login Successfull",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Login Error",
      error,
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    // find user
    const user = await userModel.findOne({ email });

    //validate password
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password required and 6 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    //updated user
    const updateUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updateUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error While updating user",
      error,
    });
  }
};

export {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
