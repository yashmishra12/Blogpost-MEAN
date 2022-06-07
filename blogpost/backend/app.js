const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config()


const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')


const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then( () => {console.log("Connected to MongoDB DataBase")})
  .catch( () => {console.log("Connection failed")});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})


app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
