const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '62cda01dddb6e843ca23f07d'
  };

  next();
})

app.use('/', require('./routes/users'))
app.use('/', require('./routes/cards'))
app.use((req, res) => {
  res.status(404);
  res.send("Wrong URL");
})
app.use(express.static(__dirname));
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})