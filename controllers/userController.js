const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const { User } = require('./../model/userModel');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//------> Get al Users
exports.getAllUsers = async (req, res, next) => {
  const users = await User.find().populate('addresses');

  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
};

//----------->OTP Generation Using twilio
const otpGen = (req, res) => {
  client.verify
    .services(process.env.SERVICE_ID)
    .verifications.create({
      to: `+91${req.body.phonenumber}`,
      channel: req.body.channel,
    })
    .then((data) => {
      console.log('OTP Sent');
    })
    .catch((err) => {
      console.log(err);
    });
};

//JWT token sign and Creation and assigning it to cookies
const signJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
};

//--------->Sending JWT as a cookie
const createSendToken = (user, statusCode, res) => {
  const token = signJwtToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);

  return token;

  // res.status(statusCode).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user,
  //   },
  // });
};

//-------->Signing in the user first using phone number and sending the OTP
module.exports.sendOtp = (req, res, next) => {
  const data = otpGen(req, res);
  res.status(200).json({
    message: 'OTP sent, head over to verify the OTP',
    data: data,
  });
};

//-------->Verifying THE OTP
module.exports.verifyOtp = async (req, res, next) => {
  //----> First find if the user exist using number
  const currentUser = await User.findOne({
    number: `+91${req.body.phonenumber}`,
  });
  console.log(currentUser);

  //----> Otp Verification
  client.verify
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({
      to: `+91${req.body.phonenumber}`,
      code: req.body.code,
    })
    .then((data) => {
      //----> Showing results according to verification and user presence
      //----> Correct OTP and user is present
      if (data.valid && currentUser) {
        const token = createSendToken(currentUser, 200, res);
        res.status(200).json({
          status: 'success(OTP Verified)',
          message: `Welcome Back ${currentUser.firstName}!!!!`,
          token,
        });
      }
      //-----> Correct OTP and User is new
      else if (data.valid && !currentUser) {
        res.status(200).json({
          status: 'success(OTP Verified)',
          message: `Welcome to the app. PLease head over to signup for your details`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).json({
        status: 'Failed',
        message: 'Wrong OTP',
      });
    });
};
// const { Otp } = require('./../model/otpModel');

//SignUp function
module.exports.signUpUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      number: `+91${req.body.number}`,
    });

    createSendToken(newUser, 200, res);

    res.status(200).json({
      message: 'successs',
      newUser,
    });

    // createSendToken(newUser, 200, res);
  } catch (err) {
    next(err);
  }
};
