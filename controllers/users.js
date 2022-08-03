const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-error');

const { getJwtToken } = require('../utils/auth');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      let prettyErr = err;
      if (err.name === 'CastError') {
        prettyErr = new ValidationError('Переданы некорректные данные');
      }
      next(prettyErr);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      let prettyErr = err;
      if (err.name === 'ValidationError') {
        prettyErr = new ValidationError('Переданы некорректные данные');
      } else if (err.code === 11000) {
        prettyErr = new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
      next(prettyErr);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(data);
    })
    .catch((err) => {
      let prettyErr = err;
      if (err.name === 'ValidationError') {
        prettyErr = new ValidationError('Переданы некорректные данные');
      }
      next(prettyErr);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.params;
  User.findOneAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(data);
    })
    .catch((err) => {
      let prettyErr = err;
      if (err.name === 'ValidationError') {
        prettyErr = new ValidationError('Переданы некорректные данные');
      }
      next(prettyErr);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user.id);
      res.send({ token });
    })

    .catch((err) => {
      next(err);
    });
};

module.exports.getInfo = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      let prettyErr = err;
      if (err.name === 'ValidationError') {
        prettyErr = new ValidationError('Переданы некорректные данные');
      }
      next(prettyErr);
    });
};
