import express from 'express';
import { authUser } from '../middlewares/authUser.js';
import { clearCart, getCart, updateCart } from '../controllers/cart.controller.js';

const router = express.Router();
router.get('/get', authUser, getCart);
router.post("/update", authUser, updateCart);
router.delete('/clear', authUser, clearCart);

export default router;