const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/file-posts/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", Controller.homepage);
router.post("/", upload.single("filePosts"), Controller.createPost);

module.exports = router;
