import jwt from 'jsonwebtoken';

// Middleware to protect routes
const AuthUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'default_secret_key');
    console.log(decoded)

    // Attach user info to request
    req.user = decoded;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default AuthUser;
