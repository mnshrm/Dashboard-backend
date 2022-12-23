const catchAsyncError = require("../Middleware/catchAsyncError");
const sendToken = require("../Utils/jwtToken.js");
const User = require("../Models/userModel.js");
const ErrorHandler = require("../Utils/errorHandler.js");
const jwt = require("jsonwebtoken");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({ email: email }).select("+password");

  if (findUser) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// User log in

exports.userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user has provided email and password or not

  if (!email || !password) {
    return next(new ErrorHandler("Enter email and password", 401));
  }

  // Since we specified select to be false for password in user schema we need to explicitly specify to select password field.
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("email does not exists, sign in", 404));
  }
  const passwordMatched = await user.comparePassword(password);

  if (!passwordMatched) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  sendToken(user, 200, res);
});

// Log out user

exports.logOutUser = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(
      new ErrorHandler("Please log in before accessing this resource", 403)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData.id);

  sendToken(user, 200, res);
});
