const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database to check role
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
        
        req.userId = decoded.userId;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = adminAuthMiddleware;