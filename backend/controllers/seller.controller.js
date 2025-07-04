import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required', 
                success: false 
            });
        }
        
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            // FIXED: Add role to token
            const token = jwt.sign({ email, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
                path: '/'
            });
            
            res.status(200).json({ message: 'Login successful', success: true });
        } else {
            return res.status(400).json({ message: 'Invalid email or password', success: false });
        }

    } catch (error) {
        console.error('Error logging in seller:', error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict',
            path: '/'
        });
        
        console.log('Seller logged out successfully');
        
        res.status(200).json({ 
            message: 'Seller logout successful', 
            success: true 
        });
    } catch (error) {
        console.error('Seller logout error:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            success: false 
        });
    }
};

//check auth seller : /api/seller/is-auth
export const isAuthSeller = (req, res) => {
    try {
        const token = req.cookies.sellerToken;
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No token provided', 
                success: false 
            });
        }
        
        // FIXED: Actually verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.email === process.env.SELLER_EMAIL) {
            res.status(200).json({ 
                message: 'Seller is authenticated', 
                success: true,
                seller: { email: decoded.email }
            });
        } else {
            res.status(401).json({ 
                message: 'Invalid token', 
                success: false 
            });
        }
        
    } catch (error) {
        console.error('Error checking seller authentication:', error);
        
        // FIXED: Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token', 
                success: false 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired', 
                success: false 
            });
        }
        
        res.status(500).json({ 
            message: 'Internal Server error', 
            success: false 
        });
    }
};