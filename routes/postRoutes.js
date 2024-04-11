import express from 'express'
import { requireSignIn } from '../controllers/userController.js';
import { createPostController, deletePostController, getAllPostController, getUserPostController, updatePostController } from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', requireSignIn, createPostController)
router.get('/get-all-post', getAllPostController)
router.get('/get-user-post', requireSignIn,getUserPostController)
router.delete('/delete-post/:id', requireSignIn, deletePostController)
router.put('/update-post/:id', requireSignIn, updatePostController)
export default router;