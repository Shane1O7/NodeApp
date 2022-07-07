const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
  },
  name: {
    type: String,
    required: [true, 'A name is required'],
  },
  phoneNumber: {
    type: Number,
    required: [true, 'A number is required'],
  },
  addressDetails: {
    type: String,
    required: [true, 'Address details required'],
  },
  streetNo: String,
  city: {
    type: String,
    required: [true, 'A City is required'],
  },
  district: {
    type: String,
    required: [true, 'A district is required'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Address must belong to a User'],
  },
});

module.exports.Address = mongoose.model('Address', addressSchema);
