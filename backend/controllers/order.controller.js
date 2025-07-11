import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import dotenv from "dotenv";
dotenv.config();
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
        })
        .populate("items.product")
        .populate("userId", "name email")
        .populate("address") 
        .sort({ createdAt: -1 });
                   
        res.status(200).json({ orders, success: true });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

//get all orders for admin : api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
        .populate("items.product")
        .populate("userId", "name email")
        .populate("address")
        .sort({ createdAt: -1 });
        
        res.status(200).json({ orders, success: true });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address");

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }
        
        res.status(200).json({ order, success: true });
    } catch (error) {
        console.error("Get single order error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        console.log(`Updating order ${orderId} to status: ${status}`);
        
        // Validate orderId
        if (!orderId || orderId.length !== 24) {
            return res.status(400).json({ 
                message: "Invalid order ID", 
                success: false 
            });
        }
        
        // Validate status
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: "Invalid order status. Must be one of: " + validStatuses.join(', '), 
                success: false 
            });
        }
        
        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                message: "Order not found", 
                success: false 
            });
        }
        
        // ✅ Prevent ANY status updates for cancelled orders
        if (order.status === 'Cancelled') {
            return res.status(400).json({ 
                message: "Cannot update status of a cancelled order", 
                success: false 
            });
        }
        
        // ✅ Prevent ANY status updates for delivered orders
        if (order.status === 'Delivered') {
            return res.status(400).json({ 
                message: "Cannot update status of a delivered order. Order is already complete.", 
                success: false 
            });
        }
        
        // ✅ Prevent backwards status updates (e.g., from Shipped to Processing)
        const statusOrder = {
            'Processing': 0,
            'Shipped': 1,
            'Delivered': 2,
            'Cancelled': -1  // Special case
        };
        
        // Only allow forward progression (except for cancellation)
        if (status !== 'Cancelled' && statusOrder[status] <= statusOrder[order.status]) {
            return res.status(400).json({ 
                message: `Cannot change status from ${order.status} to ${status}. Orders can only progress forward.`, 
                success: false 
            });
        }
        
        // ✅ Additional validation: Can't cancel shipped orders
        if (status === 'Cancelled' && order.status === 'Shipped') {
            return res.status(400).json({ 
                message: "Cannot cancel a shipped order", 
                success: false 
            });
        }
        
        // Update status
        order.status = status;
        
        // ✅ Auto-update payment status when delivered
        if (status === 'Delivered') {
            order.isPaid = true;
            console.log(`✅ Order ${orderId} marked as paid (delivered)`);
        }
        
        await order.save();
        
        // Populate and return updated order
        const updatedOrder = await Order.findById(orderId)
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address");
        
        console.log(`✅ Order ${orderId} status updated to: ${status}`);
        
        res.status(200).json({ 
            message: `Order status updated to ${status}${status === 'Delivered' ? ' and marked as paid' : ''}`,
            order: updatedOrder, 
            success: true 
        });
    } catch (error) {
        console.error("❌ Update order status error:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            success: false,
            error: error.message 
        });
    }
};

// ✅ Also update cancelOrder to prevent cancelling shipped orders
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user;
        
        console.log(`🔄 Cancelling order ${orderId} for user ${userId}`);
        
        // Find order and check if it belongs to user
        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ 
                message: "Order not found", 
                success: false 
            });
        }
        
        // ✅ Check if order can be cancelled (only Processing orders)
        if (order.status === 'Delivered') {
            return res.status(400).json({ 
                message: "Order cannot be cancelled as it's already delivered", 
                success: false 
            });
        }
        
        if (order.status === 'Shipped') {
            return res.status(400).json({ 
                message: "Order cannot be cancelled as it's already shipped", 
                success: false 
            });
        }
        
        if (order.status === 'Cancelled') {
            return res.status(400).json({ 
                message: "Order is already cancelled", 
                success: false 
            });
        }
        
        // ✅ Only allow cancellation of Processing orders
        if (order.status !== 'Processing') {
            return res.status(400).json({ 
                message: "Order can only be cancelled while processing", 
                success: false 
            });
        }
        
        // Cancel the order
        order.status = 'Cancelled';
        await order.save();
        
        const updatedOrder = await Order.findById(orderId)
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address");
        
        console.log(`✅ Order ${orderId} cancelled successfully`);
        
        res.status(200).json({ 
            message: "Order cancelled successfully",
            order: updatedOrder, 
            success: true 
        });
    } catch (error) {
        console.error("❌ Cancel order error:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            success: false,
            error: error.message 
        });
    }
};