const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json()); // parsing json requests
app.use('/images', express.static(path.join(__dirname, 'images')));

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

mongoose
  .connect(
    'mongodb+srv://Maksym:uu5ilolpimP123@cluster0-lzpzy.mongodb.net/feed?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8080);
  })
  .catch(error => console.log(error));

// npm install --save express-validator
// npm install --save mongodb mongoose
