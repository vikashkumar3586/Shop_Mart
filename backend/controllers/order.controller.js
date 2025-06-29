import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import dotenv from "dotenv";
dotenv.config();
import stripe from "stripe";


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

//Place order stripe payment : api/order/online
//Place order stripe payment : api/order/online
export const placeOrderOnline = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user;
        const { origin } = req.headers;

        console.log('Online order request:', { userId, items, address });

        if (!items || !address) {
            return res.status(400).json({ message: "Items and address are required", success: false });
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`,
                    success: false
                });
            }

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });

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

        console.log('Order created:', order._id);

        //Stripe gateway initialization
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line item for stripe
        const lineItems = productData.map((item) => {
            const unitAmountINR = Math.round(item.price * 100); // Convert ₹ to paisa
            console.log(`Item: ${item.name}, Price: ₹${item.price}, Unit Amount (paisa): ${unitAmountINR}`);
            
            return {
                price_data: {
                    currency: 'inr', // Keep INR
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmountINR, // FIXED: Full price in paisa
                },
                quantity: item.quantity,
            };
        });

        console.log('Line items for Stripe:', lineItems);

        //create stripe session
        const session = await stripeInstance.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/loader?next=/my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString(),
            },
        });

        console.log('Stripe session created:', session.id);

        res.status(201).json({ 
            message: "Order placed successfully", 
            success: true,
            url: session.url 
        });

    } catch (error) {
        console.error('Error in placeOrderOnline:', error);
        res.status(500).json({ 
            message: "Internal server error", 
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
            $or: [{ paymentType: "COD" }, { isPaid: false }]
        }).populate("items.product").populate("address").sort({ createdAt: -1 });
        res.status(200).json({ orders, success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}