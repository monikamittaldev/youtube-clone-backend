import jwt from "jsonwebtoken";

/**
 * Middleware to protect private routes by verifying JWT token.
 */
const protect = (req, res, next) => {
  const authToken = req.headers.authorization;

  // Check Authorization header
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token, access denied",
    });
  }

  // Extract token
  const token = authToken.split(" ")[1];

  try {
    // Verify token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decodedUser;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token, access denied",
    });
  }
};

export default protect; 