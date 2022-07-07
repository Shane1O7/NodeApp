const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  // { timestamps: true }
);

userSchema.virtual('addresses', {
  ref: 'Address',
  foreignField: 'user',
  localField: '_id',
});

// userSchema.methods.genJWT = function () {
//   const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: '7d',
//   });
// };

module.exports.User = mongoose.model('User', userSchema);
