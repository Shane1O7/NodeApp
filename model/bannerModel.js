const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is required'],
  },
  itemType: {
    type: String,
  },
  itemImage: {
    type: String,
  },
});

module.exports.Banner = mongoose.model('Banner', bannerSchema);
