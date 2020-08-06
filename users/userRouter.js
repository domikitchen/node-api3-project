const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');
const { reset } = require('nodemon');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const newUser = req.body;

  Users.insert(newUser)
    .then(user => {
      if(newUser.hasOwnProperty('name')){
        res.status(201).json(user);
      }
      else if(newUser.name === undefined){
        res.status(404).json({ error: "Please provide a valid name for user" });
      }
      else{
        res.status(404).json({ error: "Please provide a valid name for user" });
      }
    })
    .catch(error => {
      console.log(error.response);
      res.status(500).json({ error: "There was an issue with uploading your user" });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = req.body;
  newPost.user_id = req.params.id;

  Posts.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).status({ error: "Something went wrong while uploading this post" });
    });
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ message: "There was an error retrieving the users" });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  Users.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong while retrieving the user" });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;

  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong while retrieving the posts" });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;

  Users.remove(id)
    .then(response => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong deleting this user" });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  Users.update(id, changes)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong updating this user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user){
        next();
      }
      else{
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}

function validateUser(req, res, next) {
  if(req.body === undefined){
    res.status(400).json({ message: "missing user data" });
  }
  else if(req.body.name === undefined){
    res.status(400).json({ message: "missing required name field" });
  }
  else{
    next();
  }
}

function validatePost(req, res, next) {
  if(req.body === undefined){
    res.status(400).json({ message: "missing post data" });
  }
  else if(req.body.text === undefined){
    res.status(400).json({ message: "missing required text field" });
  }
  else{
    next();
  }
}

module.exports = router;
