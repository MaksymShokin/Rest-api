const path = require('path');
const fs = require('fs');

const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = 2;
  let totalItems;

  Post.countDocuments()
    .then(numPosts => {
      totalItems = numPosts;
      return Post.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
      res
        .status(200)
        .json({
          message: 'Posts fetched',
          posts: posts,
          totalItems: totalItems
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.postPosts = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Data validation failure');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace('\\', '/');

  const postData = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Maksym' }
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Post fetched', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Data validation failure');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }

  if (!imageUrl) {
    const error = new Error('No image picked');
    error.statusCode = 404;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Updated succesfully', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(() => {
      res.status(200).json({ message: 'Deleted succesfully' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
