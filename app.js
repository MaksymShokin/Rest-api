const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json()); // parsing json requests

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', '*'); //Content-type Authorization
  next();
});

app.use('/feed', feedRoutes);

mongoose
  .connect( 'mongodb+srv://Maksym:uu5ilolpimP123@cluster0-lzpzy.mongodb.net/feed?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(8080);
  })
  .catch(error => console.log(error));

// npm install --save express-validator
// npm install --save mongodb mongoose
