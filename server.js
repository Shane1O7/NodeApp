const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { query } = require('express');

dotenv.config({ path: './config.env' });

const app = require('./app');
const { connect } = require('http2');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log('DB Connection Successful..');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server Running on port ${port}.....`);
});
