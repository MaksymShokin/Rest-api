const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');

const { validationResult } = require('express-validator');

exports.putSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Data validation failure');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        posts: []
      });
      return user.save();
    })
    .then(result => {
      res
        .status(201)
        .json({ message: 'Signup successful', usedId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      const error = new Error('Email does not exist');
      error.statusCode = 401;
      throw error;
    }

    loadedUser = user;

    return bcrypt
      .compare(password, user.password)
      .then(doMatch => {
        if (!doMatch) {
          const error = new Error('Wrong password');
          error.statusCode = 401;
          throw error;
        }

        const token = jwt.sign(
          {
            email: loadedUser.email,
            id: loadedUser._id.toString()
          },
          'mysecret',
          { expiresIn: '1h' }
        );

        res.status(200).json({
          message: 'Login successful',
          token: token,
          userId: loadedUser._id.toString()
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }

        next(err);
      });
  });
};

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User does not exist');
        error.statusCode = 401;
        throw error;
      }

      res.status(200).json({ message: 'Status fetched', status: user.status });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.putStatus = (req, res, next) => {
  const updatedStatus = req.body.status;
  
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error('User does not exist');
        error.statusCode = 401;
        throw error;
      }
    
      user.status = updatedStatus;
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Status updated', status: result.status });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};
