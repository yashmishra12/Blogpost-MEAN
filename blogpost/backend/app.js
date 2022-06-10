const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

const mongoPW = "mongodb+srv://yashmishra12:" + process.env.MONGO_ATLAS_PW + "@cluster0.mhauoj2.mongodb.net/?retryWrites=true&w=majority"

const app = express();

mongoose.connect(mongoPW)
  .then( () => {console.log("Connected to MongoDB DataBase")})
  .catch( () => {console.log("Connection failed")});


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use('/photoblog', express.static(path.join(__dirname, './../dist/blogpost')));
app.get('/photoblog/*', (req, res) => {
    res.sendFile(path.join(__dirname + './../dist/blogpost/index.html'));
});

app.use((req, res, next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
