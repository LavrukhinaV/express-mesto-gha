const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: validator.isURL,
      message: 'URL невалидный',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email невалидный',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);

// const User = mongoose.model('user', userSchema)

// const validateUser = (user) => {
//   const schema = Joi.object({
//     email: Joi.string().email().min(5).max(500).required(),
//     password: Joi.string().min(8).max(1024).required(),
//   })
//   return schema.validate(user)
// }
// module.exports = {
//   User,
//   validateUser,
// }
