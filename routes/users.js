const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('', getUsers);
router.get('/me', getInfo);
router.get('/:userId', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._[\]+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_[\]+.~#?&//=]*)/),
  }),
}), updateUserAvatar);

module.exports = router;
