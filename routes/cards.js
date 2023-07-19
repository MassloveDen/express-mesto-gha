const cardsRouter = require("express").Router();

const {
  getCards,
  createCards,
  deleteCard,
  putLike,
  removeLike,
} = require("../controllers/cards");
const {
  validateCardId,
  validateCard,
} = require("../middlewares/cardValidator");

cardsRouter.get("/", getCards);
cardsRouter.post("/", validateCard, createCards);
cardsRouter.delete("/:cardId", validateCardId, deleteCard);
cardsRouter.put("/:cardId/likes", validateCardId, putLike);
cardsRouter.delete("/:cardId/likes", validateCardId, removeLike);
module.exports = cardsRouter;
