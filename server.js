const express = require('express');

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

const server = express();

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>/users or /posts</h2>`);
});

server.use('/users', userRouter);
server.use('/posts', postRouter);

//custom middleware

function logger(req, res, next) {
  req.name = req.headers.name;
  var ms = new Date().valueOf();

  console.log(`${req.method}, ${req.url}, ${ms}`)

  next();
}

module.exports = server;
