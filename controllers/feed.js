const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'Hello REST API',
        content: 'bla bla',
        creator: { name: 'Maksym' },
        image: 'images/MyAppCost.png',
        createdAt: new Date()
      }
    ]
  });
};

exports.postPosts = (req, res, text) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status('422').json({
      message: 'Validation failure',
      validationErrors: errors.array()
    });
  }

  const postData = new Post({
    title: title,
    content: content,
    imageUrl: '../images/MyAppCost.png',
    creator:  { name: 'Maksym' },
  });

  postData
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Success',
        post: result
      });
    })
    .catch(err => {
      console.log(err)
    }); 
};
