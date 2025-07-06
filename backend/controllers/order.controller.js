import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import dotenv from "dotenv";
dotenv.config();
// ✅ CHANGED: Replace stripe with razorpay
import Razorpay from "razorpay";

//Place order COD : api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user;

        if (!items || !address) {
            return res.status(400).json({ message: "Items and address are required", success: false });
        }
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`,
                    success: false
                });
            }
            amount += product.offerPrice * item.quantity;
        }

        //Add tax charge 2%
        amount += Math.floor((amount * 2) / 100);
        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            isPaid: false,
        });
        res.status(201).json({ message: "Order placed successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ UPDATED: Place order with Razorpay payment : api/order/online
export const placeOrderOnline = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user;
        
        if (!items || !address) {
            return res.status(400).json({ message: "Items and address are required", success: false });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);   
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`,
                    success: false
                });
            }
            amount += product.offerPrice * item.quantity;
        }

        //Add tax charge 2%
        amount += Math.floor((amount * 2) / 100);

        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
            isPaid: false,
        });

        // ✅ NEW: Razorpay instance initialization
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // ✅ NEW: Create Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise (INR * 100)
            currency: 'INR',
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                userId: userId.toString(),
            }
        });

        res.status(201).json({ 
            message: "Order created successfully", 
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
            orderDbId: order._id
        });

    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

// ✅ NEW: Verify Razorpay payment : api/order/verify-payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId } = req.body;
        
        // ✅ Verify payment signature
        const crypto = await import('crypto');
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment is verified, update order
            await Order.findByIdAndUpdate(orderDbId, {
                isPaid: true,
                paymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id
            });

            res.status(200).json({ 
                message: "Payment verified successfully", 
                success: true 
            });
        } else {
            res.status(400).json({ 
                message: "Invalid payment signature", 
                success: false 
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            message: "Payment verification failed", 
            error: error.message 
        });
    }
};

//order details for individual user : api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product").populate("address").sort({ createdAt: -1 });
        res.status(200).json({ orders, success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

//get all orders for admin : api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }] // ✅ FIXED: Show paid orders for seller
        }).populate("items.product").populate("address").sort({ createdAt: -1 });
        res.status(200).json({ orders, success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}