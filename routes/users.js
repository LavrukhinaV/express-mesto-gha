const router = require('express').Router();
const {
  getUsers, getUser, getInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('', getUsers);
router.get('/me', getInfo);
router.get('/:userId', getUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
