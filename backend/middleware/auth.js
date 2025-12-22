// Authentication Middleware
// Verifies JWT tokens and attaches user to request

const authenticate = async (req, res, next) => {
  try {
    // TODO: Implement JWT authentication
    // 1. Get token from header (Authorization: Bearer <token>)
    // 2. Verify token
    // 3. Get user from token
    // 4. Attach user to req.user
    // 5. Call next()
    
    // For now, skip authentication (remove this in production)
    // req.user = { id: 'temp-user-id' };
    // next();
    
    // Placeholder - will be implemented with JWT
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

module.exports = authenticate;

