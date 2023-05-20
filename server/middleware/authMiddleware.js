import { verifyToken } from "../controllers/authController.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Middleware to check for JWT
const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }

  try {
    const decoded = verifyToken(token);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token is no longer exist.",
          401
        )
      );
    }

    const tokenIssuedAt = decoded.iat;
    const passwordUpdatedAt = Math.round(
      currentUser.passwordChangeAt.getTime() / 1000
    );

    if (passwordUpdatedAt > tokenIssuedAt) {
      return next(
        new AppError("User recently changed password! Please login again.", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError("Invalid token. Please login again.", 401));
  }
});

// Middleware to check for roles
const restrictTo = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  next();
};

export { protect, restrictTo };
