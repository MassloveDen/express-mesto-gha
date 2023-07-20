const Card = require('../models/card');
const { CODE, CODE_CREATED, ERROR_NOT_FOUND } = require('../utils/constants');

const { handleError } = require('../utils/handlers');

const checkCard = (card, res) => {
  if (card) {
    return res.send({ data: card });
  }
  return res.status(ERROR_NOT_FOUND).send({
    message: `Карточка с указанным _id не найдена`,
  });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate([
      { path: 'owner', model: 'user' },
      { path: 'likes', model: 'user' },
    ])
    .then((card) => {
      res.status(CODE).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CODE_CREATED).send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete({ _id: cardId })
    .populate([{ path: 'owner', model: 'user' }])
    .then((card) => {
      if (card.deletedCount !== 0) {
        return res.send({ message: 'Карточка была удалена' });
      }
      return res.status(ERROR_NOT_FOUND).send({
        message: `Карточка с указанным _id не найдена`,
      });
    })
    .catch((err) => handleError(err, res));
};

const updateLikes = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .populate([
      { path: 'owner', model: 'user' },
      { path: 'likes', model: 'user' },
    ])
    .then((user) => checkCard(user, res))
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  const owner = req.user._id;
  const newData = { $addToSet: { likes: owner } };
  updateLikes(req, res, newData, next);
};

module.exports.removeLike = (req, res, next) => {
  const owner = req.user._id;
  const newData = { $pull: { likes: owner } };
  updateLikes(req, res, newData, next);
};
