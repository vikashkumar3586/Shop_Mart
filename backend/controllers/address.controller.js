import Address from "../models/address.model.js";
// Add new address : api/address/add
export const addAddress = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ 
                message: "Please login to add address", 
                success: false,
                requiresLogin: true  // Flag to trigger redirect
            });
        }
        const {address} = req.body;
        await Address.create({
            ...address,
            userId,});
        res.status(201).json({ message: "Address added successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

//get adress: /api/address/get
export const getAddress = async (req, res) => {
    const userId = req.user;
    try {  
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ addresses, success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}