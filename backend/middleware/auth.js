// Authentication middleware - Verifies JWT token
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user ID to request object
        req.userId = decoded.userId;
        
        // Continue to next middleware/route handler
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;