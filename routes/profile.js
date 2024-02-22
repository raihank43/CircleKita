const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profilePicture/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", Controller.profile);
router.get("/create", Controller.createProfile);
router.post("/create", upload.single("profileImage"), Controller.saveProfile);
router.get("/edit", Controller.editProfile);
router.post("/edit", upload.single("profileImage"), Controller.saveEditProfile);

router.get("/:username", Controller.othersProfile);

router.get("/deletePost/:id", Controller.deletePost);

module.exports = router;
