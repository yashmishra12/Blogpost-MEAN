const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();
const postRoutes = require('./routes/posts')

mongoose.connect(process.env.MONGODB_URL)
  .then( () => {console.log("Connected to MongoDB DataBase")})
  .catch( () => {console.log("Connection failed")});

app.use(bodyParser.json());

app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})


app.use("/api/posts", postRoutes);

module.exports = app;
