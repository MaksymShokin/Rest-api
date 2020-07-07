const express = require('express');

const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/posts
router.post(
  '/posts',
  [
    body('title', 'Title should be at least 5 chars long')
      .trim()
      .isLength({ min: 5 }),

    body('content', 'Content should be at least 5 chars long')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.postPosts
);

// single post
// GET /feed/post
router.get('/post/:postId', feedController.getPost);

// update post
// PUT /feed/post
router.put(
  '/post/:postId',
  [
    body('title', 'Title should be at least 5 chars long')
      .trim()
      .isLength({ min: 5 }),

    body('content', 'Content should be at least 5 chars long')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updatePost
);

// delete post 
// DELETE /feed/post
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
