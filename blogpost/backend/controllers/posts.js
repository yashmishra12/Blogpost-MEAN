const Post = require('../models/post');



exports.createdPost = (req, res, next)=> {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post(
                      { title: req.body.title,
                        content: req.body.content,
                        imagePath: url + "/images/" + req.file.filename,
                        creator: req.userData.userId
                      }
                        );

  post.save().then( (createdPost) => {
    res.status(201).json({
      message: "Post Saved",
      post: { id: createdPost._id, ...createdPost }
    });
  })

}


exports.getPosts = (req, res) => {
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
}


exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then( (result) => {

    if(result.deletedCount > 0) {
      res.status(200).json({message: "Delete Successful"});
    } else {
      res.status(401).json({message: "Not Authorized to Delete"});
    }
  })
}

exports.editPost = (req, res, next) => {

  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath =  url + "/images/" + req.file.filename
  }

  const post = new Post({_id:req.body.id,
                          title: req.body.title,
                          content: req.body.content,
                          imagePath: imagePath,
                          creator: req.userData.userId});

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then( (result) => {

    if(result.matchedCount > 0) {
      res.status(200).json({message: "Update Successful"});
    } else {
      res.status(401).json({message: "Not Authorized to Edit"});
    }

  })
}

exports.getPost = (req, res, next) => {

  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }
    else { res.status(404).json({message: "Post not Found!"}); }
  })
}
