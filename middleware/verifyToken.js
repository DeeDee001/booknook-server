const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token in Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: No token provided or invalid format",
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "booknook_jwt_secret_key_change_me_in_production";

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access: Invalid or expired token",
      });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
