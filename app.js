require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorCelebrate = require('celebrate').errors;
const router = require('./routes/index');
const { ERROR_INTERNAL_SERVER } = require('./utils/constants');
const errHandlers = require('./utils/handlers');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());
app.use(express.json());
app.use('/', router);
app.use(errorCelebrate());
app.use(errHandlers);

app.use((err, req, res, next) => {
  res.status(ERROR_INTERNAL_SERVER).send({
    message: 'На сервере произошла ошибка',
  });

  next();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
