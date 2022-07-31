const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err')
const ConflictError = require('../errors/conflict-error');

const { getJwtToken, JWT_SECRET } = require('../utils/auth');

const {
  ValidationErrorCode,
  UnauthorizedErrorCode,
  ForbiddenErrorCode,
  NotFoundErrorCode,
  ConflictErrorCode,
  DefaultErrorCode,
} = require('../utils/errorCode');

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
        throw new NotFoundError('Нет пользователя с таким id');
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
    .then((user) => res.status(201).send({ data: user }))
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
        res.status(NotFoundErrorCode).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
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
        res.status(NotFoundErrorCode).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
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

  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Неправильные почта или пароль' });
      }
      bcrypt.compare(password, user.password, (e, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неправильный пароль' });
        }
        const token = getJwtToken(user.id);
        return res.send({ token });
      });
    })
    .catch(() => res.status(DefaultErrorCode).send({ message: 'Ошибка сервера' }));
    // .cstch((err) => {
    //   next(err);
    // });
};

module.exports.getInfo = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, JWT_SECRET).id;

  User.findById(payload)
    .then((user) => {
      if (!user) {
        res.status(NotFoundErrorCode).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
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
