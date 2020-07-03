const { validationResult } = require('express-validator');

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

  // create post in db
  res.status(201).json({
    message: 'Success',
    post: {
      _id: Math.random(),
      title: title,
      content: content,
      creator: { name: 'Maksym' },
      createdAt: new Date()
    }
  });
};
