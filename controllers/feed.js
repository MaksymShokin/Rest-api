exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'Hello REST API', content: 'bla bla' }]
  });
};

exports.postPosts = (req, res, text) => {
  const title = req.body.title;
  const content = req.body.content;

  // create post in db
  res.status(201).json({
    message: 'Success',
    post: { id: Math.random(), title: title, content: content }
  });
};
