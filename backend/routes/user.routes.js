import express from 'express';
import { registerUser,loginUser,logoutUser, isAuthUser } from '../controllers/user.controller.js';
import { authUser } from '../middlewares/authUser.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/is-auth', authUser, isAuthUser);
router.post('/logout', authUser, logoutUser);
export default router;