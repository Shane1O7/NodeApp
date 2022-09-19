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
        const newFileName = `image-${Math.random()}${Date.now()}.jpeg`;
        const fullPath = `CampaignMedia/` + newFileName;
        cb(null, fullPath);
      },
    }),
  });

exports.createBanner = (req, res, next) => {
  //   console.log(req.file);
  // console.log(req.body);

  const uploadMultiple = upload('bucket-influish').fields([
    {
      name: 'itemImage',
      maxCount: 3,
    },
    {
      name: 'image',
      maxCount: 3,
    },
  ]);

  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.log('multi Error');
      console.log(err);
      return res.status(400).json({
        status: 'failure',
        message: err,
      });
    }

    console.log(req.files);
    // const location = req.file.location;

    // const newBanner = await Banner.create({
    //   title: req.body.title,
    //   itemType: req.body.itemType,
    //   itemImage: location,
    // });

    res.status(200).json({
      status: 'success',
    });
  });

  // console.log(newBanner);
};

// exports.singleUpload = (req, res, next) => {
//   const uploadSingle = upload('bucket-influish').single('image');

//   uploadSingle(req, res, async (err) => {
//     if (err) {
//       console.log('Sngle Error');
//       console.log(err);
//       return res.status(400).json({
//         status: 'failure',
//         message: err,
//       });
//     }

//     console.log(req.file);
//     next();
//   });
// };

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
