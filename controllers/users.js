const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { getJwtToken, JWT_SECRET } = require('../utils/auth');

const {
  ValidationError,
  DocumentNotFoundError,
  DefaultError,
} = require('../utils/errorCode');

module.exports.getUsers = (req, res) => {
  // try {
  //   if (!isAuthorised(req.headers.authorization)) {
  //     return res.status(401).send({ message: 'Недостаточно прав' });
  //   }
  // } catch (err) {
  //   res.status(DefaultError).send({ message: 'Ошибка сервера' });
  // }

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

module.exports.login = (req, res) => {
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
    // .catch(() => res.status(DefaultError).send({ message: 'Ошибка сервера' }));
    .cstch((err) => {
      next(err);
    });
};

module.exports.getInfo = (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, JWT_SECRET).id;

  User.findById(payload)
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
