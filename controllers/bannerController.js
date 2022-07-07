const { Banner } = require('./../model/bannerModel');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');
const catchAsync = require('./../utils/catchAsync');
const { castArray } = require('lodash');

AWS.config = new AWS.Config();

const s3 = new S3Client({
  region: `${process.env.S3_REGION}`,
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      // acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });

exports.createBanner = (req, res, next) => {
  //   console.log(req.file);
  //   console.log(req.body);

  const uploadSingle = upload('bucket-influish').single('itemImage');

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: 'failure',
        message: err,
      });
    }
    console.log(req.file.location);
    const location = req.file.location;

    const newBanner = await Banner.create({
      title: req.body.title,
      itemType: req.body.itemType,
      itemImage: location,
    });

    res.status(200).json({
      status: 'success',
      data: newBanner,
    });
  });

  // console.log(newBanner);
};

exports.getbanners = catchAsync(async (req, res, next) => {
  const banners = await Banner.find();

  res.status(200).json({
    status: 'Success',
    results: banners.length,
    data: {
      banners,
    },
  });
});
