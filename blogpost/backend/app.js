const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post')
const mongoose = require('mongoose');
const { createShorthandPropertyAssignment } = require('typescript');
require('dotenv').config()

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then( () => {console.log("Connected to MongoDB DataBase")})
  .catch( () => {console.log("Connection failed")});

app.use(bodyParser.json());

app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

app.post("/api/posts", (req, res)=> {
  const post = new Post({title: req.body.title, content: req.body.content});

  post.save().then( (createdPost) => {
    res.status(201).json({
      message: "Post Saved",
      postId: createdPost._id
    });
  });


});


app.get("/api/posts", (req, res) => {
  Post.find().then( docs => {

      res.status(200).json({
        message: "Fetched Documents Successfully.",
        posts: docs
      })
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then( (result) => {
    console.log(result);
    res.status(200).json({message: "Post Deleted"});
  })
});

module.exports = app;
