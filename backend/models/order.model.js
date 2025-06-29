import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref: "User"
    },
    items:[{
        product:{
            type: String,
            ref: "Product",
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },    
    }],
    amount:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true,
        ref: "Address"
    },
    status:{
        type: String,
        // enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Order Placed"
    },
    paymentType:{
        type: String,
        // enum: ["COD", "Online"],
        // default: "COD",
        required: true
    },
    isPaid:{
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps: true});
const Order = mongoose.model("Order", orderSchema);
export default Order;