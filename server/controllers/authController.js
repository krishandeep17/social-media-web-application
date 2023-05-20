import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/sendEmail.js";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
} from "../utils/emailTemplate.js";

const signToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createSendToken = (user, res) => {
  const token = signToken({ id: user._id }, "30d");

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const emailVerification = async (user, res) => {
  const emailVerifyToken = signToken({ id: user.id, email: user.email }, "24h");

  const emailVerifyUrl = `http://localhost:1710/api/v1/users/verifyEmail/${emailVerifyToken}`;

  const username =
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

  try {
    await sendEmail({
      email: user.email,
      subject: "Email verification for FriendsPlace account",
      html: verifyEmailTemplate(username, emailVerifyUrl),
    });

    res.status(200).json({
      status: "success",
      message:
        "We need to confirm your email address. To complete the account verification process, please click the link in the email we've just sent you.",
    });
  } catch (error) {
    return next(
      new AppError(
        "There were an error sending the account verification email. Try again later!",
        500
      )
    );
  }
};

// @desc    Sign Up User & Send Verification Email
// @route   POST /api/v1/users/signup
// @access  Public
const signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    birthYear,
    birthMonth,
    birthDate,
  } = req.body;

  if (password?.length < 8) {
    return next(
      new AppError("Password must contain at least 8 characters", 400)
    );
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashPassword,
    gender,
    birthYear,
    birthMonth,
    birthDate,
  });

  await emailVerification(user, res);
});

// @desc    Verify User's Email
// @route   PATCH /api/v1/users/verifyEmail/:emailVerifyToken
// @access  Public
const verifyEmail = async (req, res, next) => {
  const { emailVerifyToken } = req.params;

  try {
    const decoded = verifyToken(emailVerifyToken);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(
          "The user belonging to this token is no longer exist.",
          401
        )
      );
    }

    if (user.isVerified) {
      return next(new AppError("This email is already activated.", 400));
    }

    user.isVerified = true;
    await user.save();

    createSendToken(user, res);
  } catch (error) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
};

// @desc    Log In User
// @route   POST /api/v1/users/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  if (!user.isVerified) {
    await emailVerification(user, res);
  }

  createSendToken(user, res);
});

// @desc    Forgot Password - Send Password Reset Token To Email
// @route   POST /api/v1/users/forgotPassword
// @access  Public
const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  const resetToken = signToken({ email: user.email }, "10m");

  const resetUrl = `http://localhost:1710/api/v1/users/resetPassword/${resetToken}`;

  const username =
    user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset for FriendsPlace account",
      html: resetPasswordTemplate(username, resetUrl),
    });

    res.status(200).json({
      status: "success",
      message: `Email has been successfully sent. You are retrieving your password, The reset link has been sent to your email ${user.email}, please go and check it`,
    });
  } catch (error) {
    return next(
      new AppError(
        "There were an error sending the email. Try again later!",
        500
      )
    );
  }
});

// @desc    Reset Password
// @route   PATCH /api/v1/users/resetPassword/:resetToken
// @access  Public
const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (password?.length < 8) {
    return next(
      new AppError("Password must contain at least 8 characters", 400)
    );
  }

  try {
    const decoded = verifyToken(resetToken);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return next(
        new AppError(
          "The user belonging to this token is no longer exist.",
          401
        )
      );
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    createSendToken(user, res);
  } catch (error) {
    return next(new AppError("Token is invalid or has expired", 401));
  }
});

// @desc    Update Current User Password
// @route   PATCH /api/v1/users/updateMyPassword
// @access  Public
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (newPassword?.length < 8) {
    return next(
      new AppError("Password must contain at least 8 characters", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  const hashPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashPassword;
  user.passwordChangeAt = new Date();
  await user.save();

  createSendToken(user, res);
});

export {
  verifyToken,
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
