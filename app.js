const { PORT = 3001 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { DocumentNotFoundError } = require('./utils/errorCode');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62cda01dddb6e843ca23f07d',
//   };

//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(DocumentNotFoundError);
  res.send({ message: 'Неправильный адрес' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
