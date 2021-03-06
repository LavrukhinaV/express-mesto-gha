const User = require('../models/user');

const {
  ValidationError,
  DocumentNotFoundError,
  DefaultError,
} = require('../utils/errorCode');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DefaultError).send({ message: 'Ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DefaultError).send({ message: 'Ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DefaultError).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DefaultError).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(DocumentNotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DefaultError).send({ message: 'Ошибка сервера' });
    });
};
