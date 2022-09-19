const express = require('express');
const morgan = require('morgan');
const userRouter = require('./Routes/userRoutes');
const addressRouter = require('./Routes/addressRoutes');
const bannerRouter = require('./Routes/bannerRoutes');
const hello = require('api/hello');
const bodyParser = require('body-parser');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
app.use(express.json());

app.use(morgan('dev'));

app.use(bodyParser.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/banner', bannerRouter);
app.use('api/hello', hello);

app.all('*', (req, res, next) => {
  // console.log(res.statusCode);
  console.log('hii');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
