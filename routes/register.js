const express = require("express");
const Controller = require("../controllers/controller");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", Controller.register);
router.post("/", upload.single("profileImage"), Controller.postRegister);

module.exports = router;
