const Card = require('../models/card');
const {
  CODE_CREATED,
  handleError,
} = require('../constants');



module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res
        .send(card);
    })
    .catch((error) => handleError(error, res));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CODE_CREATED).send({ data: card }))
    .catch((error) => handleError(error, res));
};

module.exports.deleteCards = (req, res) => {
  const { cardId } = req.params;
  Card.findOneAndDelete({ _id: cardId })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((error) => handleError(error, res));
};