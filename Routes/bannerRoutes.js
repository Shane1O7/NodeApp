const express = require('express');
const bannerController = require('./../controllers/bannerController');
// const multer = require('multer');

const router = express.Router();
// const upload = multer({ dest: 'uploads' });
router.route('/').post(bannerController.createBanner).get(bannerController.getbanners);

module.exports = router;
