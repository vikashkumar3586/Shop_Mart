import User from '../models/user.model.js';

// Get user cart : api/cart/get
export const getCart = async (req, res) => {
    try {
        const userId = req.user;
        
        if (!userId) {
            return res.status(401).json({
                message: "Please login to view cart",
                success: false
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cartItems: user.cartItems || {}
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update user cartData : api/cart/update
export const updateCart = async (req, res) => {
    try {
        const userId = req.user;
        const { cartItems } = req.body;
        
        if (!userId) {
            return res.status(401).json({
                message: "Please login to update cart",
                success: false
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ 
                message: 'User not found',
                success: false 
            });
        }
        
        res.status(200).json({
            message: 'Cart updated successfully',
            success: true,
            cartItems: updatedUser.cartItems
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false 
        }); 
    }
}

// Clear user cart : api/cart/clear
export const clearCart = async (req, res) => {
    try {
        const userId = req.user;
        
        if (!userId) {
            return res.status(401).json({
                message: "Please login to clear cart",
                success: false
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { cartItems: {} },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Cart cleared successfully",
            success: true
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};