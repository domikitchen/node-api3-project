const express = require('express');

Posts = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong retrieving the posts" });
    })
});

router.get('/:id', validatePostId, (req, res) => {
  const id = req.params.id;

  Posts.getById(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong while retreiving this post" });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  const id = req.params.id;

  Posts.remove(id)
    .then(response => {
      res.status(205).end();
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong deleting this user" });
    });
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  Posts.update(id, changes)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong while updating this post" });
    })
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if(post){
        next();
      }
      else{
        res.status(404).json({ message: "could not find this post"});
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    })
}

module.exports = router;
