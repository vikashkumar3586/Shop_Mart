import mongoose, {mongo} from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

    }catch(error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};