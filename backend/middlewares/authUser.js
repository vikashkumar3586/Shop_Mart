import jwt from 'jsonwebtoken';


export const authUser = (req, res, next) => {
    try{
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal Server error' });

    }
}