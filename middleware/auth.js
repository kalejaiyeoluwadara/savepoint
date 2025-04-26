// middleware/auth.js
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check header for token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "savepoint_jwt_secret"
    );

    // Get the user from the token
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
});
