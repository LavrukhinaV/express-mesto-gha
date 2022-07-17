const Card = require('../models/card');

const ValidationError = 400;
const DocumentNotFoundError = 404;
const DefaultError = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(err => res.status(DefaultError).send({ message: `Ошибка сервера ${err}` }))
}
module.exports.createCard = (req, res) => {
  Card.create({ ... req.body })
    .then(card => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if(!card) {
        res.status(DocumentNotFoundError).send({ message: "Карточка не найдена" })
        return
      }
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if(!card) {
        res.status(DocumentNotFoundError).send({ message: "Карточка не найдена" })
        return
      }
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
}

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if(!card) {
        res.status(DocumentNotFoundError).send({ message: "Карточка не найдена" })
        return
      }
      res.status(200).send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
}