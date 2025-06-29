import jwt from 'jsonwebtoken';
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(
            password === process.env.SELLER_PASSWORD &&
            email === process.env.SELLER_EMAIL
        ){
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res
            .status(200)
            .json({ message: 'Login successful', success: true });
        } else {
            return res
            .status(400)
            .json({ message: 'Invalid email or password', success: false });
        }

    } catch (error) {
        console.error('Error logging in seller:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

//logout seller : /api/seller/logout
export const sellerLogout = (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict'
        });
        res.status(200).json({ message: 'Seller logged out successfully', success: true });
    } catch (error) {
        console.error('Error logging out seller:', error);
        res.status(500).json({ message: 'Internal Server error' });
    }
    
}

//check auth seller : /api/seller/is-auth
export const isAuthSeller = (req, res) => {
    try {
                res.json({ message: 'Seller is authenticated', success: true });
    } catch (error) {
        console.error('Error checking seller authentication:', error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}