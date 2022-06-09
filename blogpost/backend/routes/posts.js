const express = require("express");

const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts")
const multerLogic = require("../middleware/multer-logic")

const router = express.Router();

router.get("", PostController.getPosts);
router.get("/:id", PostController.getPost);

router.post("", checkAuth , multerLogic, PostController.createdPost);

router.delete("/:id", checkAuth, PostController.deletePost);
router.put("/:id", checkAuth, multerLogic, PostController.editPost);



module.exports = router
