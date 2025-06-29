import express from 'express';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderOnline } from '../controllers/order.controller.js';
import { authUser } from '../middlewares/authUser.js';

import { authSeller } from '../middlewares/authSeller.js';
const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.post("/online", authUser, placeOrderOnline);
router.get("/user", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders); 

export default router;