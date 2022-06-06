const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
  };

const storage = multer.diskStorage( {
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid File Extension");
    if(isValid) { error=null; }
    cb(error, "backend/images")
  },

  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+'-'+Date.now()+'.'+ext)
                              }
});




router.post("", multer({storage}).single("image") ,(req, res, next)=> {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({title: req.body.title,
                        content: req.body.content,
                        imagePath: url + "/images/" + req.file.filename
                      });

  post.save().then( (createdPost) => {
    res.status(201).json({
      message: "Post Saved",
      post: { id: createdPost._id,
              ...createdPost
            }
    });
  });

});


router.get("", (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) { postQuery.skip(pageSize * (currentPage - 1))
                                         .limit(pageSize); }

  postQuery.then( docs => {
      fetchedPosts = docs
      return Post.count();
  }).then( count => {
    res.status(200).json({
      message: "Fetched Documents Successfully.",
      posts: fetchedPosts,
      maxPosts: count
    })
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then( (result) => {
    console.log(result);
    res.status(200).json({message: "Post Deleted"});
  })
});

router.put("/:id",multer({storage}).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath =  url + "/images/" + req.file.filename
  }

  const post = new Post({_id:req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath});

  console.log(post);

  Post.updateOne({_id: req.params.id}, post).then( (result) => {
      res.status(200).json({message: "Update Successful"});
  })
});

router.get("/:id", (req, res, next) => {

  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }
    else { res.status(404).json({message: "Post not Found!"}); }
  })
})


module.exports = router
