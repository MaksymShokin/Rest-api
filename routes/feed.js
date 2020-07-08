const express = require('express');

const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/posts
router.post(
  '/posts',
  isAuth,
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
router.get('/post/:postId', isAuth, feedController.getPost);

// update post
// PUT /feed/post
router.put(
  '/post/:postId',
  isAuth,
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
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
