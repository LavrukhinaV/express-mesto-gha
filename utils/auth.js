const jwt = require('jsonwebtoken');
// const User = require('../models/user');

const JWT_SECRET = 'secret';

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET);

// const isAuthorised = (token) => jwt.verify(token, JWT_SECRET, (err, decoded) => {
//   if (err) return false;
//   return User.findById(decoded.id)
//     .then((user) => Boolean(user));
// });

module.exports = {
  getJwtToken,
  JWT_SECRET,
};
