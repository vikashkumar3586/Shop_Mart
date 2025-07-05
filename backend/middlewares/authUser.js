// import jwt from 'jsonwebtoken';



// export const authUser = (req, res, next) => {
//     try{
//         const { token } = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({ 
//                 message: 'Unauthorized', 
//                 success: false 
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.id;
//         next();
//     } catch (error) {
//         console.error('Error authenticating user:', error);
//         res.status(500).json({ message: 'Internal Server error' });

//     }
// }

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set req.user to just the user ID (to match your controller expectation)
        req.user = decoded.id;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};