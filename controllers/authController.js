const { promisify } = require('util');
const { User } = require('./../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async (req, res, next) => {
  //-> Getting the token and check if its true
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }

  //-> Verifying The Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  //   console.log(decoded);

  //-> Verify if the usser still exists...
  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser) {
    return next(new AppError('The User belonging to this toke does not exist anymore', 401));
  }

  //-> Grant access to protected routes
  req.user = currentUser;
  next();
});
