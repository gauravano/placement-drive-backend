const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(morgan('dev')); // For logging the requests in the terminal

mongoose.connect(
  process.env.MONGO_URI,
  {
    useMongoClient: true
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/api/student', require('./routes/student'));
app.use('/api/company', require('./routes/company'));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;