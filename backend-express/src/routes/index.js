const express = require("express");
const upload = require("../middlewares/upload");
const postController = require("../controllers/post.controller");
const { validatePost } = require("../utils/validators/post");

const router = express.Router();

router.get("/posts", postController.findPosts);
router.post(
  "/posts",
  upload.single("image"),
  validatePost,
  postController.createPost
);
router.get("/posts/:id", postController.findPostById);
router.put(
  "/posts/:id",
  upload.single("image"),
  validatePost,
  postController.updatePost
);
router.delete("/posts/:id", postController.deletePost);

module.exports = router;
