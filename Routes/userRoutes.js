const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const addressRouter = require('./../Routes/addressRoutes');
const { reverse } = require('lodash');

const router = express.Router();

router.use('/address/:userId', addressRouter);

router.post('/signup', userController.signUpUser);
router.post('/signup/sendotp', userController.sendOtp);
router.post('/signup/verifyotp', userController.verifyOtp);

router.get('/', userController.getAllUsers);

router.post('/login', async (req, res, next) => {
  res.send('login route');
});
router.post('/refresh-token', authController.protect, async (req, res, next) => {
  res.send('refresh token route');
});
router.post('/register', async (req, res, next) => {
  res.send('register route');
});

router.delete('/logout', async (req, res, next) => {
  res.send('logout route');
});
module.exports = router;
