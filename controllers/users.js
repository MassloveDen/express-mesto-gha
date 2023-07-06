const User = require('../models/user');
const {
  CODE_CREATED,
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  handleError,
} = require('../constants');


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CODE_CREATED).send(user))
    .catch((error) => handleError(error, res));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => handleError(error, res));
};

module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((error) => {
      if (error.name === 'error') {
        res
          .status(ERROR_CODE)
          .send({ message: `Ошибка загрузки данных ${ERROR_CODE}` });
      }
      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({
          message: `Внутренняя ошибка сервера ${ERROR_INTERNAL_SERVER}`,
        });
    });
};