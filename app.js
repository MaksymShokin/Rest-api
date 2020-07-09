const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json()); // parsing json requests
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //'*'
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://Maksym:uu5ilolpimP123@cluster0-lzpzy.mongodb.net/feed?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    const server = app.listen(8080);
    const io = require('./socket').init(server);

    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
  .catch(error => console.log(error));

// npm install --save express-validator
// npm install --save mongodb mongoose
// npm install --save uuid
// npm install --save multer
// npm install --save bcryptjs
// npm install --save jsonwebtoken
// npm install --save socket.io
