const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
// const { ERROR_NOT_FOUND } = require('./constants');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a6a5a01d78b112715bfa34',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});