import express from "express";
import {
  loginController,
  registerController,
  requireSignIn,
  updateUserController,
} from "../controllers/userController.js";
//router obj
const router = express.Router();

//routes register type post
router.post("/register", registerController);

//login type post

router.post("/login", loginController);

//Update

router.put("/update-user", requireSignIn, updateUserController);


//export
export default router;
