const express = require('express');
const addressController = require('./../controllers/addressController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect, addressController.CreateAddress)
  .get(addressController.getAllAddress);

module.exports = router;
