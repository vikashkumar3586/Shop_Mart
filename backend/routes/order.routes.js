import express from 'express';
import { cancelOrder, getAllOrders, getSingleOrder, getUserOrders, placeOrderCOD, placeOrderOnline, updateOrderStatus } from '../controllers/order.controller.js';
import { authUser } from '../middlewares/authUser.js';

import { authSeller } from '../middlewares/authSeller.js';
const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.post("/online", authUser, placeOrderOnline);
router.get("/user", authUser, getUserOrders);
router.put("/user/:orderId/cancel", authUser, cancelOrder);


router.get("/seller", authSeller, getAllOrders); 
router.get("/seller/:orderId", authSeller, getSingleOrder);
router.put("/seller/:orderId/status", authSeller, updateOrderStatus);

export default router;