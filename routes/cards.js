const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._[\]+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_[\]+.~#?&//=]*)/).required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/[0-9a-fA-F]{24}$/),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/[0-9a-fA-F]{24}$/),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/[0-9a-fA-F]{24}$/),
  }),
}), dislikeCard);

module.exports = router;
