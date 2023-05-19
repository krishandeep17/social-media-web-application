import multer from "multer";
import AppError from "../utils/appError.js";

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleMulterError = (err) => {
  const message = `Image upload failed: ${err.message}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational(trusted error) : Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming(or other unknown error) : Don't leak error details
  } else {
    console.error("ERROR 🤯", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    // HANDLING DATABASE ERROR
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    if (err instanceof multer.MulterError) {
      // Multer error
      res.status(400).send("File upload failed: " + err.message);
    }

    sendErrorProd(error, res);
  }
};

export default errorController;
