const { Address } = require('./../model/addressModel');
const catchAsync = require('./../utils/catchAsync');

exports.CreateAddress = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const newAddress = await Address.create(req.body);

  res.status(201).json({
    status: 'Success',
    Address: {
      newAddress,
    },
  });
});

exports.getAllAddress = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.userId) filter = { user: req.params.userId };
  const addresses = await Address.find(filter);

  res.status(200).json({
    status: 'Success',
    results: addresses.length,
    data: {
      addresses,
    },
  });
});
