const User = require('../models/user');

const ValidationError = 400;
const DocumentNotFoundError = 404;
const DefaultError = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => res.status(DefaultError).send({ message: `Ошибка сервера ${err}` }))
}

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if(!user) {
        res.status(DocumentNotFoundError).send({ message: "Запрашиваемый пользователь не найден" })
        return
      }
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
}

module.exports.createUser = (req, res) => {
  User.create({ ... req.body })
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
      }
      res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
    })
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { name, about }, { new: true, runValidators: true })
  .then((data) => {
    if(!data) {
      res.status(DocumentNotFoundError).send({ message: "Запрашиваемый пользователь не найден" })
      return
    }
    res.send(data)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
    }
    res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
  })
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { avatar }, { new: true, runValidators: true })
  .then((data) => {
    if(!data) {
      res.status(DocumentNotFoundError).send({ message: "Запрашиваемый пользователь не найден" })
      return
    }
    res.send(data)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(ValidationError).send({ message: "Переданы некорректные данные" })
    }
    res.status(DefaultError).send({ message: `Ошибка сервера ${err}` })
  });
};
