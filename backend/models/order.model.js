import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
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
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    },
    paymentType:{
        type: String,
        enum: ["COD", "Online"],
        // default: "COD",
        required: true
    },
    paymentId: {
        type: String,
        default: null
    },
    isPaid:{
        type: Boolean,
        required: true,
        default: false
    }
},{ timestamps: true });
const Order = mongoose.model("Order", orderSchema);
export default Order;