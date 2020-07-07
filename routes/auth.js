const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

// auth/signup
router.put(
  '/signup/',
  [
    body('email', 'Email is not valid')
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userData => {
          if (userData) {
            return Promise.reject('This email address already exists');
          }
        });
      }),
    body('password', 'Password should be at least 5 chars long')
      .trim()
      .isLength({ min: 5 }),
    body('name', 'Name should be at least 5 chars long')
      .trim()
      .notEmpty()
  ],
  authController.putSignup
);

module.exports = router;
